# 📊 CASANOVA FASHION POINT
## Complete Project Documentation for College Presentation

**Project Name:** Casanova Fashion Point - Men's Fashion E-Commerce Platform  
**Technology:** Django (Python Web Framework)  
**Database:** SQLite  
**Payment Gateways:** Stripe, Razorpay, UPI  
**Student Name:** [Your Name]  
**Date:** February 1, 2026

---

## TABLE OF CONTENTS

1. Project Overview
2. What is ER Diagram?
3. ER Diagram for This Project
4. What is DFD?
5. Level 0 DFD (Context Diagram)
6. Level 1 DFD (Detailed Process Flow)
7. Code Structure Explanation
8. System Working Flow
9. Key Features
10. Technologies Used
11. Conclusion

---

## 1. PROJECT OVERVIEW

**Casanova Fashion Point** is a modern **Men's Fashion E-Commerce Website** built using the Django web framework. The system allows users to:

- Browse a catalog of men's fashion products
- Add items to a shopping cart
- Create user accounts or shop as guests
- Complete purchases using multiple payment methods
- Track and manage their orders
- Cancel orders if needed

**Key Highlights:**
- Support for both registered users and guest shoppers
- Session-based shopping cart
- Multiple payment integrations (Stripe, Razorpay/UPI, Demo mode)
- Bilingual admin panel (Hindi + English)
- Indian currency support (₹)
- Responsive design for mobile and desktop
- Order management with cancellation feature

---

## 2. WHAT IS ER DIAGRAM?

**ER Diagram (Entity-Relationship Diagram)** is a visual representation of the database structure. It shows:

### Components:

1. **Entities (Tables):** 
   - Objects or concepts that store data
   - Examples: User, Product, Order, Category

2. **Attributes (Columns):**
   - Properties or characteristics of entities
   - Examples: name, price, email, address

3. **Relationships:**
   - How entities are connected to each other
   - Types: One-to-One (1:1), One-to-Many (1:N), Many-to-Many (M:N)

### Keys:

- **Primary Key (PK):** Unique identifier for each record
- **Foreign Key (FK):** Reference to primary key in another table

### Why ER Diagram is Important:

- Helps visualize database structure
- Shows data dependencies
- Aids in database design and optimization
- Makes it easier to understand relationships between data

---

## 3. ER DIAGRAM FOR THIS PROJECT

```
┌─────────────────────────────────────────────┐
│              USER (Built-in Django)         │
│─────────────────────────────────────────────│
│ • id (PK) - Unique user identifier          │
│ • username - Login username                 │
│ • email - User email address                │
│ • password - Encrypted password             │
│ • first_name - User first name              │
│ • last_name - User last name                │
└──────────────────┬──────────────────────────┘
                   │
                   │ One-to-Many Relationship
                   │ (One user → Many orders)
                   │
                   ▼
┌─────────────────────────────────────────────┐
│                  ORDER                      │
│─────────────────────────────────────────────│
│ • id (PK) - Unique order identifier         │
│ • user (FK) - Reference to User             │
│ • session_key - For guest users             │
│ • date_ordered - Order timestamp            │
│ • complete - Boolean (True/False)           │
│ • transaction_id - Payment reference        │
│ • status - 'placed' or 'cancelled'          │
└──────────────┬──────────────────────────────┘
               │
               │ One-to-Many
               │ (One order → Many items)
               │
               ▼
┌─────────────────────────────────────────────┐
│              ORDER ITEM                     │
│─────────────────────────────────────────────│
│ • id (PK) - Unique item identifier          │
│ • order (FK) - Reference to Order           │
│ • product (FK) - Reference to Product       │
│ • quantity - Number of items                │
│ • date_added - When added to cart           │
└───────────────────┬─────────────────────────┘
                    │
                    │ Many-to-One
                    │ (Many items → One product)
                    │
                    ▼
┌─────────────────────────────────────────────┐
│                 PRODUCT                     │
│─────────────────────────────────────────────│
│ • id (PK) - Unique product identifier       │
│ • name - Product name                       │
│ • price - Product price (Decimal)           │
│ • category (FK) - Reference to Category     │
│ • description - Product details             │
│ • image - Product image                     │
│ • stock - Available quantity                │
└──────────────────┬──────────────────────────┘
                   │
                   │ Many-to-One
                   │ (Many products → One category)
                   │
                   ▼
┌─────────────────────────────────────────────┐
│                CATEGORY                     │
│─────────────────────────────────────────────│
│ • id (PK) - Unique category identifier      │
│ • name - Category name                      │
│   Examples: "Shirts", "Pants", "Jackets"    │
└─────────────────────────────────────────────┘


┌─────────────────────────────────────────────┐
│           SHIPPING ADDRESS                  │
│─────────────────────────────────────────────│
│ • id (PK) - Unique address identifier       │
│ • user (FK) - Reference to User             │
│ • order (FK) - Reference to Order           │
│ • address - Street address                  │
│ • city - City name                          │
│ • state - State/Province                    │
│ • zipcode - Postal code                     │
│ • date_added - When address was saved       │
└─────────────────────────────────────────────┘
     ▲
     │ One-to-One
     │ (One order → One shipping address)
     │
     └─────── Connected to ORDER
```

### Relationship Explanation:

1. **User → Order (1:N)**
   - One user can place multiple orders
   - Each order belongs to one user (or guest session)

2. **Order → OrderItem (1:N)**
   - One order can contain multiple items
   - Each item belongs to one order

3. **Product → OrderItem (1:N)**
   - One product can appear in many order items
   - Each order item refers to one product

4. **Category → Product (1:N)**
   - One category can have multiple products
   - Each product belongs to one category

5. **Order → ShippingAddress (1:1)**
   - Each order has one shipping address
   - Each address belongs to one order

---

## 4. WHAT IS DFD?

**DFD (Data Flow Diagram)** is a visual representation showing how data moves through a system. It illustrates the flow of information from input to processing to output.

### Components:

1. **External Entities (Rectangles):**
   - Sources or destinations of data outside the system
   - Examples: Customer, Admin, Payment Gateway

2. **Processes (Circles/Rounded Rectangles):**
   - Actions that transform data
   - Examples: Process Payment, Update Cart, Verify User

3. **Data Stores (Open Rectangles):**
   - Where data is stored
   - Examples: Database, Session Storage

4. **Data Flows (Arrows):**
   - Movement of data between components
   - Shows direction and type of data

### DFD Levels:

- **Level 0 (Context Diagram):** High-level overview of entire system
- **Level 1:** Breaks down major processes
- **Level 2:** Further detailed breakdown (if needed)

### Why DFD is Important:

- Shows system functionality clearly
- Helps identify data requirements
- Useful for system analysis and design
- Easy for non-technical people to understand

---

## 5. LEVEL 0 DFD (CONTEXT DIAGRAM)

```
                    Product Browsing Request
              ┌──────────────────────────────────┐
              │                                  │
              ▼                                  │
    ┌──────────────────┐                         │
    │                  │   Product Information   │
    │    CUSTOMER      │◄────────────────────────┘
    │  (User/Guest)    │
    │                  │   Order Details
    └────┬─────────────┘   Cart Updates
         │                 Order Status
         │                 
         │                 
         ▼                 
┌──────────────────────────────────────────────────────┐
│                                                      │
│        CASANOVA FASHION E-COMMERCE SYSTEM            │
│                                                      │
│  • Product Management                                │
│  • Shopping Cart                                     │
│  • User Authentication                               │
│  • Order Processing                                  │
│  • Payment Integration                               │
│                                                      │
└────┬──────────────────────┬────────────────────┬─────┘
     │                      │                    │
     │ Payment Request      │ Confirmation       │ Product/Order Data
     │ Transaction Data     │ Receipt            │ User Information
     │                      │                    │
     ▼                      ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   PAYMENT    │    │    ADMIN     │    │   DATABASE   │
│   GATEWAY    │    │    USER      │    │              │
│              │    │              │    │  (SQLite)    │
│ • Stripe     │    │ • Manage     │    │              │
│ • Razorpay   │    │   Products   │    │ • Users      │
│ • UPI        │    │ • View       │    │ • Products   │
│              │    │   Orders     │    │ • Orders     │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Data Flow Description:

1. **Customer ↔ System:**
   - Request: Browse products, search, add to cart
   - Response: Product details, cart status, order confirmation

2. **System ↔ Payment Gateway:**
   - Request: Payment authorization, transaction processing
   - Response: Payment status, transaction ID

3. **System ↔ Admin:**
   - Input: Product data, inventory updates
   - Output: Order reports, sales data

4. **System ↔ Database:**
   - Continuous read/write operations for all data

---

## 6. LEVEL 1 DFD (DETAILED PROCESS FLOW)

```
                         CUSTOMER
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        │                   │                   │
   Browse Products     Login/Signup        Add to Cart
        │                   │                   │
        ▼                   ▼                   ▼
  ┌──────────┐        ┌──────────┐        ┌──────────┐
  │ Process  │        │ Process  │        │ Process  │
  │   1.1    │        │   1.2    │        │   1.3    │
  │          │        │          │        │          │
  │   VIEW   │        │   USER   │        │  UPDATE  │
  │ PRODUCTS │        │   AUTH   │        │   CART   │
  │          │        │          │        │          │
  └────┬─────┘        └────┬─────┘        └────┬─────┘
       │                   │                   │
       │ Product Data      │ User Credentials  │ Cart Data
       │                   │                   │
       ▼                   ▼                   ▼
  ┌────────────────────────────────────────────────┐
  │           DATABASE (Data Store D1)             │
  │                                                │
  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
  │  │ Products │  │  Users   │  │  Orders  │    │
  │  │ Category │  │ Sessions │  │ OrderItem│    │
  │  └──────────┘  └──────────┘  └──────────┘    │
  └────────────────┬───────────────────────────────┘
                   │
                   │ Order Data
                   │
                   ▼
            ┌──────────┐
            │ Process  │
            │   1.4    │
            │          │
            │ CHECKOUT │◄───── Shipping Info (Customer)
            │          │
            └────┬─────┘
                 │
                 │ Order Total
                 │ Payment Details
                 │
                 ▼
            ┌──────────┐           ┌─────────────────┐
            │ Process  │           │    PAYMENT      │
            │   1.5    │  Request  │    GATEWAY      │
            │          │──────────►│                 │
            │ PROCESS  │           │  • Stripe       │
            │ PAYMENT  │◄──────────│  • Razorpay     │
            │          │ Response  │  • UPI          │
            └────┬─────┘           └─────────────────┘
                 │
                 │ Payment Status
                 │ Transaction ID
                 │
                 ▼
            ┌──────────┐
            │ Process  │
            │   1.6    │
            │          │
            │ CONFIRM  │
            │  ORDER   │
            │          │
            └────┬─────┘
                 │
                 │ Order Confirmation
                 │
                 ▼
            CUSTOMER
```

### Process Descriptions:

**Process 1.1 - View Products:**
- Input: Product request from customer
- Process: Retrieve product list from database
- Output: Display products with images, prices, descriptions

**Process 1.2 - User Authentication:**
- Input: Username, password (or signup details)
- Process: Validate credentials, create session
- Output: Login success/failure, user session

**Process 1.3 - Update Cart:**
- Input: Product ID, action (add/remove)
- Process: Update OrderItem quantity in database
- Output: Updated cart count, total price

**Process 1.4 - Checkout:**
- Input: Shipping address, payment method selection
- Process: Validate order, prepare payment request
- Output: Payment page, order summary

**Process 1.5 - Process Payment:**
- Input: Payment details, order total
- Process: Send to payment gateway, verify response
- Output: Transaction ID, payment status

**Process 1.6 - Confirm Order:**
- Input: Payment success confirmation
- Process: Mark order complete, save shipping address
- Output: Order confirmation, email receipt

---

## 7. CODE STRUCTURE EXPLANATION

### 7.1 Models (Database Tables) - `store/models.py`

#### **Category Model**
```python
class Category(models.Model):
    name = models.CharField(max_length=200)
```
**Purpose:** Stores product categories  
**Example Data:** "Shirts", "Pants", "Jackets", "Shoes"

---

#### **Product Model**
```python
class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    stock = models.IntegerField(default=0)
```
**Purpose:** Stores all product information  
**Key Features:**
- Linked to Category via Foreign Key
- Automatic placeholder images if no image uploaded
- Stock tracking for inventory management

**Methods:**
- `imageURL` property: Returns image URL or placeholder

---

#### **Order Model**
```python
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    session_key = models.CharField(max_length=40, null=True)
    date_ordered = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False)
    transaction_id = models.CharField(max_length=100, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
```
**Purpose:** Represents shopping cart (incomplete) or completed order  
**Key Features:**
- Supports both logged-in users (`user`) and guests (`session_key`)
- Tracks completion status and payment transaction
- Has status: 'placed' or 'cancelled'

**Methods:**
- `get_cart_total`: Calculates total price of all items
- `get_cart_items`: Counts total number of items

---

#### **OrderItem Model**
```python
class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField(default=0)
    date_added = models.DateTimeField(auto_now_add=True)
```
**Purpose:** Links products to orders with quantity information  
**Key Features:**
- Junction table between Order and Product
- Stores quantity of each product in an order

**Methods:**
- `get_total`: Calculates item total (price × quantity)

---

#### **ShippingAddress Model**
```python
class ShippingAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    zipcode = models.CharField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)
```
**Purpose:** Stores delivery address for each order  
**Key Features:**
- One-to-one relationship with Order
- Stores complete address details

---

### 7.2 Views (Business Logic) - `store/views.py`

#### **Main Page Views:**

**1. `store(request)` - Homepage**
- Retrieves all products from database
- Gets current user's cart
- Renders product catalog

**2. `cart(request)` - Shopping Cart**
- Retrieves all items in current order
- Displays cart with update/remove options
- Shows total price and item count

**3. `checkout(request)` - Checkout Page**
- Shows order summary
- Displays shipping address form
- Provides payment method options (Stripe/Razorpay/Demo)
- Redirects to cart if empty

**4. `signup(request)` - User Registration**
- Handles user registration form
- Creates new user account
- Auto-login after signup

**5. `orders(request)` - Order History**
- Shows all completed orders for logged-in user
- Displays order details and status
- Provides cancel option

---

#### **AJAX/API Views:**

**6. `updateItem(request)` - Update Cart (AJAX)**
- Receives: Product ID, Action (add/remove)
- Creates or updates OrderItem
- Increments/decrements quantity
- Deletes item if quantity reaches 0
- Returns: Success response

**7. `create_checkout_session(request)` - Stripe Payment**
- Creates Stripe checkout session
- Prepares line items with product details
- Returns: Stripe checkout URL
- Redirects user to Stripe payment page

**8. `create_razorpay_order(request)` - Razorpay/UPI Payment**
- Creates Razorpay order
- Converts amount to paise (₹1 = 100 paise)
- Returns: Order ID, Key ID for frontend
- Used for UPI and card payments

**9. `verify_razorpay_payment(request)` - Verify Payment**
- Verifies payment signature for security
- Marks order as complete
- Creates shipping address record
- Returns: Success/failure status

**10. `processOrder(request)` - Demo Payment**
- For testing without payment gateway
- Generates demo transaction ID
- Marks order as complete
- Creates shipping address

---

### 7.3 URL Routing - `store/urls.py`

```python
urlpatterns = [
    path('', views.store, name="store"),                    # Homepage
    path('cart/', views.cart, name="cart"),                 # Cart page
    path('checkout/', views.checkout, name="checkout"),     # Checkout
    path('orders/', views.orders, name="orders"),           # Order history
    path('login/', auth_views.LoginView, name='login'),     # Login
    path('signup/', views.signup, name='signup'),           # Registration
    path('update_item/', views.updateItem, name="update_item"),  # AJAX
    path('create-checkout-session/', ...),                  # Stripe API
    path('verify-razorpay-payment/', ...),                  # Razorpay API
    path('process_order/', views.processOrder, ...),        # Demo payment
]
```

**URL Pattern Explanation:**
- Clean, user-friendly URLs
- Separate routes for pages and API endpoints
- Named URLs for easy reference in templates

---

### 7.4 Templates (HTML Pages)

**1. `store.html` - Product Catalog**
- Displays product grid with images
- "Add to Cart" buttons
- Category filtering

**2. `cart.html` - Shopping Cart**
- Shows all cart items
- Quantity update buttons (+/-)
- Remove item option
- Total price calculation
- "Proceed to Checkout" button

**3. `checkout.html` - Payment Page**
- Shipping address form (address, city, state, zipcode)
- Payment method selection (Stripe/Razorpay/Demo)
- Order summary
- Total amount display

**4. `orders.html` - Order History**
- List of all completed orders
- Order details (items, total, date)
- Order status (placed/cancelled)
- "Cancel Order" button

**5. `login.html` - Login Page**
- Username and password fields
- "Login" button
- Link to signup page

**6. `signup.html` - Registration**
- Username, password fields
- Password confirmation
- "Sign Up" button

---

### 7.5 Static Files

**JavaScript - `cart.js`**
- Handles "Add to Cart" button clicks
- Sends AJAX requests to update cart
- Updates cart count in navbar
- No page reload required

**CSS - `main.css`**
- Navy blue and gold color scheme
- Responsive design for mobile
- Modern card-based layout
- Hover effects and animations

---

## 8. SYSTEM WORKING FLOW (USER JOURNEY)

### **Scenario 1: Guest User Shopping**

**Step 1:** User visits website
- URL: `http://127.0.0.1:8000/`
- `store()` view executes
- Displays all products from database

**Step 2:** User clicks "Add to Cart"
- JavaScript in `cart.js` captures click
- Sends AJAX POST request to `/update_item/`
- `updateItem()` view executes:
  - Gets or creates session key
  - Gets or creates Order for this session
  - Creates OrderItem with quantity=1
  - Saves to database
- Returns success response
- Cart count updates on navbar

**Step 3:** User adds more items
- Same process repeats
- If item already in cart, quantity increments

**Step 4:** User views cart
- Navigates to `/cart/`
- `cart()` view executes
- Retrieves all OrderItems for current order
- Displays items with quantity and total

**Step 5:** User proceeds to checkout
- Clicks "Proceed to Checkout"
- Redirected to `/checkout/`
- `checkout()` view executes
- Shows shipping form and payment options

**Step 6:** User fills shipping address
- Enters: Address, City, State, Zipcode
- Selects payment method

**Step 7:** Payment Processing

**Option A - Stripe Payment:**
- JavaScript calls `/create-checkout-session/`
- `create_checkout_session()` creates Stripe session
- User redirected to Stripe payment page
- After payment, redirected to `/payment-success/`
- Order marked as complete

**Option B - Razorpay/UPI:**
- JavaScript calls `/create-razorpay-order/`
- QR code displayed for UPI payment
- User scans and pays
- JavaScript calls `/verify-razorpay-payment/`
- Signature verified, order marked complete

**Option C - Demo Payment:**
- JavaScript calls `/process_order/`
- Order instantly marked as complete
- No real payment processing

**Step 8:** Order Confirmation
- Order.complete = True
- ShippingAddress record created
- Transaction ID saved
- User sees success message

---

### **Scenario 2: Registered User Shopping**

**Step 1:** User logs in
- Navigates to `/login/`
- Enters username and password
- Django authenticates user
- Session created with user ID

**Step 2-7:** Same as guest user
- But Order.user is set (instead of session_key)
- Cart persists across sessions

**Step 8:** User views order history
- Navigates to `/orders/`
- `orders()` view executes
- Retrieves all completed orders for this user
- Displays order details and status

**Step 9:** User cancels order
- Clicks "Cancel Order" button
- POST request to `/orders/<id>/cancel/`
- `cancel_order()` view executes
- Order.status changed to 'cancelled'
- Order page refreshes with updated status

---

## 9. KEY FEATURES

### **1. Guest Cart (Session-Based Shopping)**

**How it works:**
- When guest user adds item to cart, system creates session
- Session key stored in Order.session_key
- Cart persists during browser session
- If user logs in later, cart can be transferred

**Benefits:**
- Users can shop without registration
- Better user experience
- Higher conversion rates

**Implementation:**
```python
def _get_order(request):
    if request.user.is_authenticated:
        return Order.objects.get_or_create(user=request.user, complete=False)
    session_key = _get_session_key(request)
    return Order.objects.get_or_create(session_key=session_key, complete=False)
```

---

### **2. Multiple Payment Options**

**A. Stripe (International Payments)**
- Supports credit/debit cards worldwide
- Secure hosted checkout page
- Automatic currency conversion
- PCI compliant

**B. Razorpay (Indian Payments)**
- Supports UPI (Google Pay, PhonePe, Paytm)
- Credit/debit cards
- Net banking
- Wallets (Paytm, Mobikwik, etc.)
- QR code payment

**C. Demo Mode**
- For testing without payment keys
- Instant order confirmation
- No real money involved

---

### **3. Order Management System**

**Features:**
- View all past orders
- See order details (items, prices, dates)
- Track order status (placed/cancelled)
- Cancel orders with one click

**Business Logic:**
- Only placed orders can be cancelled
- Cancelled orders remain in history
- Status tracking for reporting

---

### **4. Admin Panel Customization**

**Features:**
- Bilingual labels (Hindi + English)
- Custom color scheme (navy blue theme)
- Easy product management
- Bulk actions
- Search and filtering

**Example:**
- "Products (उत्पाद)"
- "Orders (ऑर्डर)"
- "Categories (श्रेणियाँ)"

---

### **5. Responsive Design**

- Works on desktop, tablet, mobile
- Bootstrap framework
- Mobile-first approach
- Touch-friendly buttons

---

### **6. Indian Currency Support**

- All prices in ₹ (Indian Rupees)
- Razorpay integration for local payments
- UPI QR code support
- Familiar payment methods for Indian users

---

## 10. TECHNOLOGIES USED

### **Backend Technologies:**

**1. Django 6.0.1 (Python Web Framework)**
- **Why Django?**
  - Rapid development
  - Built-in admin panel
  - ORM for database operations
  - Security features (CSRF, XSS protection)
  - Scalable and maintainable

**2. Python 3.13**
- Modern, powerful programming language
- Extensive libraries and frameworks
- Easy to learn and read

**3. SQLite Database**
- **Why SQLite?**
  - No separate server required
  - Perfect for development and small projects
  - File-based, easy to backup
  - Can migrate to PostgreSQL/MySQL later

---

### **Frontend Technologies:**

**1. HTML5**
- Semantic markup
- Modern web standards

**2. CSS3 + Bootstrap**
- Responsive grid system
- Pre-built components
- Custom styling for brand identity

**3. JavaScript (Vanilla JS + AJAX)**
- Dynamic cart updates
- No page reloads
- Better user experience

---

### **Payment Integrations:**

**1. Stripe API**
- Checkout Sessions API
- Secure hosted payment pages
- Webhook support

**2. Razorpay API**
- Payment Orders API
- Signature verification
- UPI, cards, wallets support

---

### **Other Libraries:**

**1. Pillow**
- Image processing
- Thumbnail generation
- Format conversion

**2. Django Auth System**
- User authentication
- Password hashing
- Session management
- Login/logout functionality

---

## 11. TECHNICAL ARCHITECTURE

### **MVC Pattern (Model-View-Template)**

Django follows MTV (Model-Template-View) pattern:

**Models** → Database structure (what data to store)  
**Views** → Business logic (what to do with data)  
**Templates** → Presentation layer (how to show data)

### **Request-Response Cycle:**

```
User Request → URL Routing → View Function → 
Model Query → Database → Model Returns Data → 
View Processes → Template Renders → HTTP Response → User
```

### **Security Features:**

1. **CSRF Protection:** Prevents cross-site request forgery
2. **Password Hashing:** Passwords never stored in plain text
3. **SQL Injection Prevention:** ORM sanitizes queries
4. **XSS Protection:** Template auto-escaping
5. **Session Security:** Secure session cookies

---

## 12. DATABASE SCHEMA DETAILS

### **Table: auth_user (Django Built-in)**
```
Columns:
- id (Primary Key, Integer, Auto-increment)
- username (String, Unique, Max 150 chars)
- email (String, Max 254 chars)
- password (String, Hashed, Max 128 chars)
- first_name (String, Max 150 chars)
- last_name (String, Max 150 chars)
- is_staff (Boolean)
- is_active (Boolean)
- date_joined (DateTime)
```

### **Table: store_category**
```
Columns:
- id (Primary Key, Integer)
- name (String, Max 200 chars)

Example Data:
1 | Shirts
2 | Pants
3 | Jackets
4 | Shoes
```

### **Table: store_product**
```
Columns:
- id (Primary Key, Integer)
- name (String, Max 200 chars)
- price (Decimal, 10 digits, 2 decimal places)
- category_id (Foreign Key → store_category.id)
- description (Text, Optional)
- image (String, File path, Optional)
- stock (Integer, Default 0)

Example Data:
1 | Classic Navy Blazer | 4999.00 | 3 | Premium wool blazer | blazer.jpg | 25
```

### **Table: store_order**
```
Columns:
- id (Primary Key, Integer)
- user_id (Foreign Key → auth_user.id, Nullable)
- session_key (String, Max 40 chars, Nullable)
- date_ordered (DateTime, Auto-generated)
- complete (Boolean, Default False)
- transaction_id (String, Max 100 chars, Nullable)
- status (String, Max 20 chars, Default 'placed')

Example Data:
1 | 5 | NULL | 2026-02-01 10:30:00 | True | STRIPE_abc123 | placed
```

### **Table: store_orderitem**
```
Columns:
- id (Primary Key, Integer)
- order_id (Foreign Key → store_order.id)
- product_id (Foreign Key → store_product.id)
- quantity (Integer, Default 0)
- date_added (DateTime, Auto-generated)

Example Data:
1 | 1 | 3 | 2 | 2026-02-01 10:25:00
2 | 1 | 7 | 1 | 2026-02-01 10:26:00
```

### **Table: store_shippingaddress**
```
Columns:
- id (Primary Key, Integer)
- user_id (Foreign Key → auth_user.id, Nullable)
- order_id (Foreign Key → store_order.id, Nullable)
- address (String, Max 200 chars)
- city (String, Max 200 chars)
- state (String, Max 200 chars)
- zipcode (String, Max 200 chars)
- date_added (DateTime, Auto-generated)

Example Data:
1 | 5 | 1 | 123 MG Road | Mumbai | Maharashtra | 400001 | 2026-02-01
```

---

## 13. API ENDPOINTS

### **Public Endpoints:**

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/` | Homepage - Product catalog | Not required |
| GET | `/cart/` | View shopping cart | Not required |
| GET | `/checkout/` | Checkout page | Not required |
| GET | `/login/` | Login page | Not required |
| GET | `/signup/` | Registration page | Not required |
| POST | `/signup/` | Register new user | Not required |
| POST | `/login/` | Authenticate user | Not required |
| POST | `/logout/` | Logout user | Required |

### **AJAX/API Endpoints:**

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/update_item/` | Add/remove cart items | `{productId, action}` |
| POST | `/create-checkout-session/` | Create Stripe session | `{shipping: {...}}` |
| POST | `/create-razorpay-order/` | Create Razorpay order | `{shipping: {...}}` |
| POST | `/verify-razorpay-payment/` | Verify payment | `{razorpay_order_id, ...}` |
| POST | `/process_order/` | Demo payment | `{form, shipping}` |

### **Protected Endpoints (Login Required):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders/` | View order history |
| POST | `/orders/<id>/cancel/` | Cancel specific order |

---

## 14. PROJECT SETUP & INSTALLATION

### **Prerequisites:**
- Python 3.13 or higher
- pip (Python package manager)
- Web browser

### **Installation Steps:**

```bash
# 1. Clone repository
git clone <repository-url>
cd mens_fashion_project

# 2. Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Mac/Linux

# 3. Install dependencies
pip install django pillow stripe razorpay matplotlib

# 4. Navigate to project directory
cd mens_fashion

# 5. Run migrations
python manage.py migrate

# 6. Create superuser for admin panel
python manage.py createsuperuser

# 7. Load sample data (optional)
python seed_data.py

# 8. Run development server
python manage.py runserver

# 9. Access the website
# Website: http://127.0.0.1:8000/
# Admin Panel: http://127.0.0.1:8000/admin/
```

---

## 15. FUTURE ENHANCEMENTS

### **Potential Features to Add:**

1. **Product Search**
   - Search bar with autocomplete
   - Filter by category, price range
   - Sort by price, popularity, rating

2. **Product Reviews & Ratings**
   - Customer reviews
   - Star ratings
   - Product Q&A section

3. **Wishlist**
   - Save items for later
   - Share wishlist with others

4. **Advanced Order Tracking**
   - Order status updates (processing, shipped, delivered)
   - Shipment tracking integration
   - Email notifications

5. **Inventory Management**
   - Low stock alerts
   - Automatic stock updates
   - Supplier management

6. **Analytics Dashboard**
   - Sales reports
   - Revenue tracking
   - Popular products analysis

7. **Email Integration**
   - Order confirmation emails
   - Password reset
   - Promotional emails

8. **Coupon System**
   - Discount codes
   - Promotional offers
   - Referral rewards

9. **Multiple Images Per Product**
   - Image gallery
   - Zoom functionality
   - 360-degree view

10. **Mobile App**
    - Native Android/iOS app
    - Push notifications
    - Better mobile experience

---

## 16. ADVANTAGES OF THIS PROJECT

### **Technical Advantages:**

1. **Scalable Architecture**
   - Clean code structure
   - Easy to add new features
   - Modular design

2. **Security**
   - Built-in Django security features
   - Secure payment processing
   - Password encryption

3. **Maintainability**
   - Well-documented code
   - Follows Django best practices
   - Easy for new developers to understand

4. **Performance**
   - Efficient database queries
   - AJAX for faster updates
   - Minimal page reloads

### **Business Advantages:**

1. **User-Friendly**
   - Intuitive interface
   - Guest checkout option
   - Multiple payment methods

2. **Indian Market Focus**
   - Rupee currency
   - UPI payments
   - Hindi language support

3. **Cost-Effective**
   - Open-source technology
   - No licensing fees
   - Low hosting requirements

4. **Reliable**
   - Proven Django framework
   - SQLite database
   - Tested payment integrations

---

## 17. CONCLUSION

### **Project Summary:**

**Casanova Fashion Point** is a complete e-commerce solution built with modern web technologies. The system successfully implements:

✅ **Database Design** - Normalized schema with proper relationships  
✅ **User Authentication** - Secure login/signup system  
✅ **Shopping Cart** - Session-based cart for guests and users  
✅ **Payment Integration** - Multiple payment gateways  
✅ **Order Management** - Complete order lifecycle  
✅ **Admin Panel** - Easy store management  
✅ **Responsive UI** - Works on all devices  

### **Learning Outcomes:**

Through this project, you gain knowledge in:
- Web application development with Django
- Database design and relationships (ER diagrams)
- System analysis and design (DFD diagrams)
- Payment gateway integration
- User authentication and authorization
- Frontend-backend integration
- AJAX and asynchronous requests
- Security best practices

### **Real-World Application:**

This project can be deployed as:
- Online fashion store
- E-commerce platform for any products
- Portfolio project for job applications
- Base for startup e-commerce business

### **Technologies Mastered:**

- **Backend:** Django, Python, ORM
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Database:** SQLite, SQL queries
- **APIs:** Stripe, Razorpay, REST APIs
- **Version Control:** Git, GitHub

---

## 18. REFERENCES & RESOURCES

### **Documentation:**
- Django Official Documentation: https://docs.djangoproject.com/
- Stripe API Documentation: https://stripe.com/docs/api
- Razorpay API Documentation: https://razorpay.com/docs/

### **Learning Resources:**
- Django Tutorial: https://www.djangoproject.com/start/
- Python Documentation: https://docs.python.org/3/
- Bootstrap Documentation: https://getbootstrap.com/docs/

### **Payment Gateway Resources:**
- Stripe Test Cards: https://stripe.com/docs/testing
- Razorpay Test Mode: https://razorpay.com/docs/payments/test-mode/

---

## 19. PRESENTATION TIPS

### **For Your College Presentation:**

1. **Start with Problem Statement**
   - Why e-commerce is important
   - Gap in market (men's fashion)
   - Need for Indian payment methods

2. **Show ER Diagram First**
   - Explain each entity clearly
   - Show relationships with examples
   - Explain why this design is efficient

3. **Then Show DFD**
   - Start with Level 0 (big picture)
   - Then drill down to Level 1 (details)
   - Explain data flow with example scenario

4. **Demo the Application**
   - Show live running website
   - Demonstrate add to cart
   - Show checkout process
   - Display order management

5. **Explain Code Structure**
   - Show models.py (database structure)
   - Show views.py (business logic)
   - Show templates (user interface)
   - Explain how they work together

6. **Highlight Key Features**
   - Guest cart
   - Multiple payments
   - Order cancellation
   - Admin panel

7. **Discuss Technology Choices**
   - Why Django? (rapid development, security)
   - Why SQLite? (simplicity, portability)
   - Why these payment gateways? (market reach)

8. **Future Scope**
   - What features can be added
   - How to scale the system
   - Deployment considerations

9. **Conclusion**
   - Summarize achievements
   - Learning outcomes
   - Real-world applications

---

## 20. APPENDIX

### **A. Glossary of Terms**

- **Django:** Python web framework for rapid development
- **ORM:** Object-Relational Mapping - database abstraction layer
- **AJAX:** Asynchronous JavaScript - updates without page reload
- **CSRF:** Cross-Site Request Forgery - security attack prevention
- **Session:** Server-side storage for user data
- **Foreign Key:** Database field linking to another table
- **Migration:** Database schema version control
- **Template:** HTML file with Django template language
- **View:** Python function handling HTTP requests
- **Model:** Python class representing database table

### **B. Common Django Commands**

```bash
# Run development server
python manage.py runserver

# Create database migrations
python manage.py makemigrations

# Apply migrations to database
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Open Django shell
python manage.py shell

# Run tests
python manage.py test
```

### **C. Project File Structure**

```
mens_fashion_project/
│
├── .venv/                          # Virtual environment
│
├── mens_fashion/                   # Django project root
│   ├── manage.py                   # Django management script
│   ├── db.sqlite3                  # Database file
│   ├── seed_data.py                # Sample data script
│   │
│   ├── core/                       # Project settings
│   │   ├── __init__.py
│   │   ├── settings.py             # Configuration
│   │   ├── urls.py                 # Root URL routing
│   │   ├── wsgi.py                 # WSGI config
│   │   └── asgi.py                 # ASGI config
│   │
│   ├── store/                      # Main application
│   │   ├── __init__.py
│   │   ├── admin.py                # Admin customization
│   │   ├── apps.py                 # App configuration
│   │   ├── models.py               # Database models
│   │   ├── views.py                # View functions
│   │   ├── urls.py                 # URL routing
│   │   ├── context_processors.py  # Template context
│   │   ├── tests.py                # Unit tests
│   │   │
│   │   ├── migrations/             # Database migrations
│   │   │   ├── __init__.py
│   │   │   ├── 0001_initial.py
│   │   │   └── ...
│   │   │
│   │   └── templates/              # HTML templates
│   │       └── store/
│   │           ├── main.html       # Base template
│   │           ├── store.html      # Product catalog
│   │           ├── cart.html       # Shopping cart
│   │           ├── checkout.html   # Checkout page
│   │           ├── orders.html     # Order history
│   │           ├── login.html      # Login page
│   │           └── signup.html     # Registration
│   │
│   └── static/                     # Static files
│       ├── css/
│       │   └── main.css            # Stylesheets
│       ├── js/
│       │   └── cart.js             # JavaScript
│       └── images/
│           └── logo.png            # Brand assets
│
├── requirements.txt                # Python dependencies
└── README.md                       # Project documentation
```

---

**END OF DOCUMENTATION**

---

**Prepared for College Presentation**  
**Project:** Casanova Fashion Point - Men's Fashion E-Commerce  
**Technology Stack:** Django, Python, SQLite, Stripe, Razorpay  
**Date:** February 1, 2026

**Good Luck with Your Presentation! 🎓**
