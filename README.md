# 🧥 Casanova Fashion Point

A modern e-commerce platform for men's fashion built with Django.

![Django](https://img.shields.io/badge/Django-5.2-green)
![Python](https://img.shields.io/badge/Python-3.13-blue)

## ✨ Features

- 🛍️ **Product Catalog** - Browse premium menswear collection
- 🛒 **Shopping Cart** - Session-based cart for guests & users
- 👤 **User Authentication** - Modern login/signup with attractive UI
- 💳 **Multiple Payment Options** - Stripe, Razorpay, UPI, Demo mode
- 📦 **Order Management** - Track orders with cancellation feature
- 🎨 **Beautiful UI** - Modern design with navy/gold color scheme
- 📱 **Responsive Design** - Works on all devices
- 🔐 **Admin Panel** - Custom styled admin with Hindi/English labels
- 💰 **Indian Currency** - All prices in ₹ (Rupees)

## 🚀 Quick Start

### Prerequisites
- Python 3.13+
- pip

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/mens_fashion_project.git
cd mens_fashion_project
```

2. **Create virtual environment**
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Mac/Linux
```

3. **Install dependencies**
```bash
pip install django pillow stripe razorpay matplotlib
```

4. **Navigate to project directory**
```bash
cd mens_fashion
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Create superuser**
```bash
python manage.py createsuperuser
# Username: admin
# Password: admin123
```

7. **Load sample data**
```bash
python seed_data.py
```

8. **Run server**
```bash
python manage.py runserver
```

9. **Open browser**
- Website: http://127.0.0.1:8000/
- Admin Panel: http://127.0.0.1:8000/admin/

## 📁 Project Structure

```
mens_fashion/
├── core/               # Django settings & config
├── store/              # Main app (models, views, templates)
│   ├── templates/      # HTML templates
│   ├── migrations/     # Database migrations
│   └── admin.py        # Custom admin panel
├── static/             # CSS, JS, Images
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript
│   └── images/         # Logo & assets
├── db.sqlite3          # Database (not in repo)
└── manage.py           # Django management
```

## 🎨 Admin Panel

Access the beautiful custom admin panel at `/admin/`

**Features:**
- 🇮🇳 Bilingual interface (Hindi + English)
- 📊 Easy product management
- 📦 Order tracking with status
- 🎨 Saffron/Gold color scheme
- ✅ Visual indicators for stock levels

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

## 💳 Payment Options

1. **Demo Payment** - Test mode (no real transactions)
2. **UPI** - rk9055436@okaxis
3. **Razorpay** - UPI/Cards/Wallets
4. **Stripe** - Credit/Debit cards

## 🛒 Features in Detail

### User Features
- Browse products by category
- Add to cart (guest & logged-in users)
- Secure checkout with shipping address
- Order history with cancellation
- Modern authentication pages

### Admin Features
- Add/Edit/Delete products
- Manage orders and shipping
- View customer details
- Track inventory (stock levels)
- Easy-to-use interface for Indian users

## 🎯 Technologies Used

- **Backend:** Django 5.2
- **Database:** SQLite
- **Frontend:** Bootstrap 4.4.1, Custom CSS
- **Payments:** Stripe, Razorpay
- **Python Libraries:** Pillow, Matplotlib

## 📝 Configuration

### Payment Setup (Optional)

Edit `core/settings.py`:

```python
# Stripe
STRIPE_PUBLIC_KEY = 'your_key_here'
STRIPE_SECRET_KEY = 'your_secret_here'

# Razorpay
RAZORPAY_KEY_ID = 'your_key_here'
RAZORPAY_KEY_SECRET = 'your_secret_here'

# UPI
UPI_ID = 'your_upi@bank'
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Created by RK905

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**⭐ If you like this project, please give it a star!**
