# Men's Fashion E-commerce Website (Final Year Project)

This repository contains the source code for a men's fashion e-commerce website developed as a final year project. The project uses a **Python Django** backend and a **HTML, CSS, and JavaScript** frontend.

## Project Diagrams

### 1. Entity-Relationship Diagram (ERD)

The ERD illustrates the relationships between the database entities.

![Entity-Relationship Diagram](./er_diagram.png)

### 2. Data Flow Diagram (DFD)

The DFD shows the flow of information through the system, detailing the processes involved in user interaction and administration.

![Data Flow Diagram](./dfd_diagram.png)

## Local Setup and Running the Project in VS Code

This guide provides step-by-step instructions to set up and run the project on your local machine using Visual Studio Code (VS Code).

### Prerequisites

Before you begin, ensure you have the following installed:

1.  **Python 3.x**: Download and install from [python.org](https://www.python.org/downloads/).
2.  **pip**: Python's package installer (usually comes with Python).
3.  **VS Code**: Download and install from [code.visualstudio.com](https://code.visualstudio.com/).
4.  **VS Code Extensions**:
    *   Python (by Microsoft)
    *   Django (by Microsoft)

### Step 1: Clone the Repository

Assuming you have the project files, place them in a folder on your computer. For a real-world scenario, you would clone the repository:

\`\`\`bash
git clone <repository-url> mens_fashion
cd mens_fashion
\`\`\`

### Step 2: Create a Virtual Environment

It is best practice to use a virtual environment to isolate project dependencies.

\`\`\`bash
# Create a virtual environment (named 'venv')
python3 -m venv venv

# Activate the virtual environment
# On Windows:
# .\\venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate
\`\`\`

### Step 3: Install Dependencies

Install the required Python packages (Django is the main dependency).

\`\`\`bash
pip install django
\`\`\`

### Step 4: Run Database Migrations

The database structure (schema) needs to be created based on the Django models.

\`\`\`bash
python manage.py makemigrations store
python manage.py migrate
\`\`\`

### Step 5: Create Superuser and Seed Data

A superuser is needed to access the Django admin panel. The project has a script to create a default admin user and some initial product data.

**Default Admin Credentials:**
*   **Username:** `admin`
*   **Password:** `admin123`

\`\`\`bash
# This script creates the superuser and initial products
python seed_data.py
\`\`\`

### Step 6: Run the Development Server

Start the Django development server.

\`\`\`bash
python manage.py runserver
\`\`\`

### Step 7: Access the Website

Open your web browser and navigate to:

*   **E-commerce Store:** `http://127.0.0.1:8000/`
*   **Admin Panel:** `http://127.0.0.1:8000/admin/` (Use the `admin`/`admin123` credentials)

## Project Structure

| Directory/File | Description |
| :--- | :--- |
| `core/` | Main Django project settings and URL configuration. |
| `store/` | The main e-commerce application. Contains models, views, and URLs. |
| `store/models.py` | Defines the database structure (Product, Order, etc.). |
| `store/views.py` | Contains the business logic for the store, cart, and checkout. |
| `store/templates/store/` | HTML templates for the frontend. |
| `static/` | Static files (CSS, JavaScript, images). |
| `static/js/cart.js` | Frontend JavaScript for handling cart updates via AJAX. |
| `manage.py` | Django's command-line utility for administrative tasks. |
| `seed_data.py` | Script to populate the database with initial data. |
| `er_diagram.png` | Visual representation of the database schema. |
| `dfd_diagram.png` | Visual representation of the system's data flow. |
| `README.md` | This setup and instruction file. |
