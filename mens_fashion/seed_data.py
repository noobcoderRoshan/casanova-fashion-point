import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from store.models import Category, Product
from django.contrib.auth.models import User

# Create Superuser
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("Superuser created: admin / admin123")

# Create Categories
cat_shirts, _ = Category.objects.get_or_create(name="Shirts")
cat_pants, _ = Category.objects.get_or_create(name="Pants")
cat_shoes, _ = Category.objects.get_or_create(name="Shoes")

# Create Products (Prices in Indian Rupees)
products = [
    {"name": "Classic White Shirt", "price": 899, "category": cat_shirts, "stock": 10},
    {"name": "Denim Jeans", "price": 1499, "category": cat_pants, "stock": 15},
    {"name": "Leather Boots", "price": 1999, "category": cat_shoes, "stock": 5},
    {"name": "Polo T-Shirt", "price": 699, "category": cat_shirts, "stock": 20},
    {"name": "Chino Pants", "price": 1299, "category": cat_pants, "stock": 12},
    {"name": "Casual Sneakers", "price": 1799, "category": cat_shoes, "stock": 8},
]

for p in products:
    Product.objects.get_or_create(
        name=p['name'],
        price=p['price'],
        category=p['category'],
        stock=p['stock']
    )

print("Seed data added successfully!")
