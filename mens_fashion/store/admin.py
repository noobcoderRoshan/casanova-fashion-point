from django.contrib import admin
from django.contrib import messages
from .models import *

# Customize Admin Site Header
admin.site.site_header = "🧥 Casanova Fashion Point - Admin Panel"
admin.site.site_title = "Casanova Admin"
admin.site.index_title = "आपका स्वागत है! (Welcome!)"


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'product_count']
    search_fields = ['name']
    ordering = ['name']
    actions = ['delete_selected_categories']
    
    def delete_selected_categories(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f'✅ Successfully deleted {count} category(ies).', messages.SUCCESS)
    delete_selected_categories.short_description = "🗑️ Delete selected categories"
    
    def product_count(self, obj):
        count = obj.product_set.count()
        return f"📦 {count} Products"
    product_count.short_description = "कुल उत्पाद (Total Products)"


class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price_display', 'stock_status', 'image_tag']
    list_filter = ['category', 'price', 'stock']
    search_fields = ['name', 'description']
    ordering = ['-id']
    actions = ['delete_selected_products']
    
    def delete_selected_products(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f'✅ Successfully deleted {count} product(s).', messages.SUCCESS)
    delete_selected_products.short_description = "🗑️ Delete selected products"
    
    fieldsets = (
        ('📝 उत्पाद जानकारी (Product Information)', {
            'fields': ('name', 'category', 'description'),
            'description': 'यहाँ उत्पाद का नाम, श्रेणी और विवरण दर्ज करें'
        }),
        ('💰 मूल्य और स्टॉक (Price & Stock)', {
            'fields': ('price', 'stock'),
            'description': 'उत्पाद की कीमत (रुपये में) और उपलब्ध स्टॉक दर्ज करें'
        }),
        ('🖼️ छवि (Image)', {
            'fields': ('image',),
            'description': 'उत्पाद की तस्वीर अपलोड करें (वैकल्पिक)'
        }),
    )
    
    def price_display(self, obj):
        return f"₹{obj.price}"
    price_display.short_description = "कीमत (Price)"
    
    def stock_status(self, obj):
        if obj.stock > 10:
            return f"✅ {obj.stock} Available"
        elif obj.stock > 0:
            return f"⚠️ {obj.stock} Low Stock"
        else:
            return "❌ Out of Stock"
    stock_status.short_description = "स्टॉक स्थिति (Stock Status)"
    
    def image_tag(self, obj):
        if obj.image:
            return "✅ Uploaded"
        return "❌ Default"
    image_tag.short_description = "छवि (Image)"


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ['product', 'quantity', 'get_item_total']
    readonly_fields = ['get_item_total', 'date_added']
    can_delete = True
    
    def get_item_total(self, obj):
        return f"₹{obj.get_total}" if obj.product else "—"
    get_item_total.short_description = "कुल (Total)"


class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'customer', 'order_date', 'total_amount', 'status_badge', 'is_complete']
    list_filter = ['status', 'complete', 'date_ordered']
    search_fields = ['id', 'user__username', 'user__email']
    ordering = ['-date_ordered']
    inlines = [OrderItemInline]
    readonly_fields = ['date_ordered', 'get_cart_total']
    actions = ['delete_selected_orders']
    
    def delete_selected_orders(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f'✅ Successfully deleted {count} order(s).', messages.SUCCESS)
    delete_selected_orders.short_description = "🗑️ Delete selected orders"
    
    fieldsets = (
        ('📦 आदेश जानकारी (Order Information)', {
            'fields': ('id', 'user', 'session_key', 'date_ordered'),
        }),
        ('💳 भुगतान विवरण (Payment Details)', {
            'fields': ('transaction_id', 'complete', 'get_cart_total'),
            'description': 'भुगतान की स्थिति और कुल राशि'
        }),
        ('📋 स्थिति (Status)', {
            'fields': ('status',),
            'description': 'आदेश की वर्तमान स्थिति सेट करें'
        }),
    )
    
    def order_id(self, obj):
        return f"#Order-{obj.id}"
    order_id.short_description = "आदेश नंबर (Order #)"
    
    def customer(self, obj):
        if obj.user:
            return f"👤 {obj.user.username}"
        return "🔗 Guest User"
    customer.short_description = "ग्राहक (Customer)"
    
    def order_date(self, obj):
        return obj.date_ordered.strftime('%d-%m-%Y %H:%M')
    order_date.short_description = "तारीख (Date)"
    
    def total_amount(self, obj):
        return f"₹{obj.get_cart_total:.2f}"
    total_amount.short_description = "कुल रकम (Total Amount)"
    
    def status_badge(self, obj):
        if obj.status == 'placed':
            return "✅ Placed"
        elif obj.status == 'cancelled':
            return "❌ Cancelled"
        return obj.status
    status_badge.short_description = "स्थिति (Status)"
    
    def is_complete(self, obj):
        return "✅ Yes" if obj.complete else "⏳ No"
    is_complete.short_description = "पूर्ण (Complete)"


class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['item_id', 'product_name', 'quantity', 'unit_price', 'total_price', 'date_added']
    list_filter = ['date_added', 'product__category']
    search_fields = ['product__name', 'order__id']
    ordering = ['-date_added']
    readonly_fields = ['date_added', 'get_total']
    
    def item_id(self, obj):
        return f"Item-{obj.id}"
    item_id.short_description = "आइटम ID (Item ID)"
    
    def product_name(self, obj):
        return f"📦 {obj.product.name}" if obj.product else "❌ (Deleted)"
    product_name.short_description = "उत्पाद (Product)"
    
    def unit_price(self, obj):
        return f"₹{obj.product.price}" if obj.product else "—"
    unit_price.short_description = "प्रति यूनिट (Unit Price)"
    
    def total_price(self, obj):
        return f"₹{obj.get_total:.2f}" if obj.product else "—"
    total_price.short_description = "कुल (Total)"
    
    def date_added(self, obj):
        return obj.date_added.strftime('%d-%m-%Y %H:%M')


class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ['full_address', 'customer', 'city', 'state', 'order_ref']
    list_filter = ['state', 'city']
    search_fields = ['user__username', 'address', 'city', 'state']
    ordering = ['-date_added']
    readonly_fields = ['user', 'order']
    
    fieldsets = (
        ('ग्राहक जानकारी (Customer Information)', {
            'fields': ('user', 'order'),
        }),
        ('पता विवरण (Address Details)', {
            'fields': ('address', 'city', 'state', 'zipcode'),
            'description': 'पूरा डिलीवरी पता दर्ज करें'
        }),
    )
    
    def full_address(self, obj):
        return f"📍 {obj.address[:50]}..."
    full_address.short_description = "पता (Address)"
    
    def customer(self, obj):
        return f"👤 {obj.user.username}" if obj.user else "Guest"
    customer.short_description = "ग्राहक (Customer)"
    
    def order_ref(self, obj):
        if obj.order:
            return f"#Order-{obj.order.id}"
        return "Not Assigned"
    order_ref.short_description = "आदेश नंबर (Order #)"


# Register Models
admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(ShippingAddress, ShippingAddressAdmin)
