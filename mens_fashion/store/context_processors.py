from .models import Order


def cart_data(request):
    if request.user.is_authenticated:
        order, _ = Order.objects.get_or_create(user=request.user, complete=False)
    else:
        if not request.session.session_key:
            request.session.create()
        order, _ = Order.objects.get_or_create(session_key=request.session.session_key, complete=False)
    return {'order': order}
