# 🚀 Deployment Guide - Render.com

## Quick Deployment to Render

### Step 1: Push to GitHub
First, make sure your code is on GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "Create" → "Web Service"

### Step 3: Connect Repository
1. Select your GitHub repository: `mens_fashion_project`
2. Choose branch: `main`
3. Fill in these details:

**Name:** `casanova-fashion`  
**Runtime:** `Python`  
**Build Command:** `./build.sh`  
**Start Command:** `gunicorn core.wsgi --chdir=mens_fashion`

### Step 4: Set Environment Variables
Add these to Render dashboard:

```
DEBUG = false
SECRET_KEY = (auto-generated)
ALLOWED_HOSTS = *.onrender.com,127.0.0.1
STRIPE_PUBLIC_KEY = pk_test_your_key
STRIPE_SECRET_KEY = sk_test_your_key
RAZORPAY_KEY_ID = your_razorpay_id
RAZORPAY_KEY_SECRET = your_razorpay_secret
UPI_ID = rk9055436@okaxis
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for build to complete (2-5 minutes)
3. Access your app at: `https://casanova-fashion.onrender.com`

## Your Live Links:
- **Frontend:** https://casanova-fashion.onrender.com/
- **Admin Panel:** https://casanova-fashion.onrender.com/admin/

## Notes:
- Free tier goes to sleep after 15 minutes of inactivity
- Database data is not persistent (will reset on redeploy)
- For production, upgrade to Paid tier

## Troubleshooting:
If deployment fails, check:
1. Build log in Render dashboard
2. Ensure Python 3.13 is specified
3. Check SECRET_KEY is set
4. Verify ALLOWED_HOSTS includes your domain
