from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth import login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import json
import datetime
import stripe
import razorpay
import hashlib
import hmac
from .models import Product, Order, OrderItem, ShippingAddress


def _get_session_key(request):
    if not request.session.session_key:
        request.session.create()
    return request.session.session_key


def _get_order(request):
    if request.user.is_authenticated:
        return Order.objects.get_or_create(user=request.user, complete=False)
    session_key = _get_session_key(request)
    return Order.objects.get_or_create(session_key=session_key, complete=False)


def store(request):
    products = Product.objects.all()
    order, _ = _get_order(request)
    context = {'products': products, 'order': order}
    return render(request, 'store/store.html', context)


def cart(request):
    order, _ = _get_order(request)
    items = order.orderitem_set.all()
    context = {'items': items, 'order': order}
    return render(request, 'store/cart.html', context)


def checkout(request):
    order, _ = _get_order(request)
    items = order.orderitem_set.all()
    
    # Redirect to cart if empty
    if not items or order.get_cart_items == 0:
        return redirect('cart')
    
    context = {
        'items': items,
        'order': order,
        'stripe_public_key': settings.STRIPE_PUBLIC_KEY,
        'razorpay_key_id': settings.RAZORPAY_KEY_ID,
        'upi_id': settings.UPI_ID,
        'show_upi': bool(settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET),
    }
    return render(request, 'store/checkout.html', context)


def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('store')
    else:
        form = UserCreationForm()
    return render(request, 'store/signup.html', {'form': form})


def logout_view(request):
    logout(request)
    return redirect('store')


@login_required
def orders(request):
    orders = Order.objects.filter(user=request.user, complete=True).order_by('-date_ordered')
    orders_with_items = []
    for order in orders:
        items = order.orderitem_set.all()
        orders_with_items.append({
            'order': order,
            'items': items
        })
    return render(request, 'store/orders.html', {'orders_with_items': orders_with_items})


@login_required
def cancel_order(request, order_id):
    if request.method != 'POST':
        return redirect('orders')

    try:
        order = Order.objects.get(id=order_id, user=request.user, complete=True)
    except Order.DoesNotExist:
        return redirect('orders')

    if order.status != 'cancelled':
        order.status = 'cancelled'
        order.save()

    return redirect('orders')


def updateItem(request):
    data = json.loads(request.body)
    product_id = data['productId']
    action = data['action']

    product = Product.objects.get(id=product_id)
    order, _ = _get_order(request)
    order_item, _ = OrderItem.objects.get_or_create(order=order, product=product)

    if action == 'add':
        order_item.quantity = (order_item.quantity + 1)
    elif action == 'remove':
        order_item.quantity = (order_item.quantity - 1)

    order_item.save()

    if order_item.quantity <= 0:
        order_item.delete()

    return JsonResponse('Item updated', safe=False)


def create_razorpay_order(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request'}, status=400)

    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        return JsonResponse({
            'error': 'Razorpay keys not configured. Get free test keys from https://razorpay.com'
        }, status=400)

    data = json.loads(request.body)
    order, _ = _get_order(request)
    
    amount_in_paise = int(float(order.get_cart_total) * 100)

    try:
        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
        
        razorpay_order = client.order.create(
            amount=amount_in_paise,
            currency=settings.RAZORPAY_CURRENCY,
            payment_capture=1,
            notes={
                'order_id': str(order.id),
                'address': data['shipping'].get('address', ''),
                'city': data['shipping'].get('city', ''),
                'state': data['shipping'].get('state', ''),
                'zipcode': data['shipping'].get('zipcode', ''),
            }
        )

        return JsonResponse({
            'razorpay_order_id': razorpay_order['id'],
            'razorpay_key_id': settings.RAZORPAY_KEY_ID,
            'amount': amount_in_paise,
            'order_id': order.id,
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def verify_razorpay_payment(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request'}, status=400)

    data = json.loads(request.body)
    
    try:
        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
        
        client.utility.verify_payment_signature({
            'razorpay_order_id': data['razorpay_order_id'],
            'razorpay_payment_id': data['razorpay_payment_id'],
            'razorpay_signature': data['razorpay_signature']
        })

        order_id = data.get('order_id')
        order = Order.objects.get(id=order_id)
        order.transaction_id = data['razorpay_payment_id']
        order.complete = True
        order.status = 'placed'
        order.save()

        ShippingAddress.objects.create(
            user=order.user,
            order=order,
            address=data['shipping'].get('address', ''),
            city=data['shipping'].get('city', ''),
            state=data['shipping'].get('state', ''),
            zipcode=data['shipping'].get('zipcode', ''),
        )

        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def create_checkout_session(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request'}, status=400)

    if not settings.STRIPE_SECRET_KEY:
        return JsonResponse({'error': 'Stripe keys are not configured'}, status=400)

    data = json.loads(request.body)
    order, _ = _get_order(request)

    line_items = []
    for item in order.orderitem_set.all():
        line_items.append({
            'price_data': {
                'currency': settings.STRIPE_CURRENCY,
                'product_data': {
                    'name': item.product.name,
                },
                'unit_amount': int(item.product.price * 100),
            },
            'quantity': item.quantity,
        })

    if not line_items:
        return JsonResponse({'error': 'Cart is empty'}, status=400)

    stripe.api_key = settings.STRIPE_SECRET_KEY
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=line_items,
        mode='payment',
        success_url=request.build_absolute_uri('/payment-success/?session_id={CHECKOUT_SESSION_ID}'),
        cancel_url=request.build_absolute_uri('/checkout/'),
        metadata={
            'order_id': str(order.id),
            'address': data['shipping'].get('address', ''),
            'city': data['shipping'].get('city', ''),
            'state': data['shipping'].get('state', ''),
            'zipcode': data['shipping'].get('zipcode', ''),
        },
    )

    return JsonResponse({'url': session.url})


def payment_success(request):
    session_id = request.GET.get('session_id')
    if not session_id or not settings.STRIPE_SECRET_KEY:
        return redirect('store')

    stripe.api_key = settings.STRIPE_SECRET_KEY
    session = stripe.checkout.Session.retrieve(session_id)

    if session.payment_status == 'paid':
        order_id = session.metadata.get('order_id')
        try:
            order = Order.objects.get(id=order_id, complete=False)
        except Order.DoesNotExist:
            return redirect('store')

        order.transaction_id = session.payment_intent
        order.complete = True
        order.status = 'placed'
        order.save()

        ShippingAddress.objects.create(
            user=order.user,
            order=order,
            address=session.metadata.get('address', ''),
            city=session.metadata.get('city', ''),
            state=session.metadata.get('state', ''),
            zipcode=session.metadata.get('zipcode', ''),
        )

    return render(request, 'store/payment_success.html')


def processOrder(request):
    """Demo/Test payment processing - for testing without payment gateway keys"""
    transaction_id = datetime.datetime.now().timestamp()
    data = json.loads(request.body)

    order, _ = _get_order(request)
    total = float(data['form']['total'])
    order.transaction_id = f"DEMO_{int(transaction_id)}"

    if total == float(order.get_cart_total):
        order.complete = True
        order.status = 'placed'
    order.save()

    ShippingAddress.objects.create(
        user=order.user,
        order=order,
        address=data['shipping']['address'],
        city=data['shipping']['city'],
        state=data['shipping']['state'],
        zipcode=data['shipping']['zipcode'],
    )

    return JsonResponse({'success': True, 'message': 'Demo payment completed!'}, safe=False)
