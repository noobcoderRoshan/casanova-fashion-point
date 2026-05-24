# 🚀 RENDER DEPLOYMENT GUIDE - CASANOVA FASHION POINT

## ⚡ QUICK START (5 minutes)

### 1️⃣ Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2️⃣ Go to Render.com
- Visit: https://render.com
- Sign in with GitHub
- Click: **New** → **Web Service**

### 3️⃣ Select Repository
- Choose: `mens_fashion_project`
- Branch: `main`

### 4️⃣ Enter Configuration
```
Name: casanova-fashion
Runtime: Python
Build Command: ./build.sh
Start Command: gunicorn core.wsgi --chdir=mens_fashion
```

### 5️⃣ Add Environment Variables
Copy these into Render:

```
DEBUG=false
SECRET_KEY=your-secret-key-123456
ALLOWED_HOSTS=*.onrender.com,127.0.0.1
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
UPI_ID=rk9055436@okaxis
```

### 6️⃣ Click Deploy!
Wait 2-5 minutes... Done! 🎉

---

## 📋 FILES CREATED FOR RENDER

| File | Purpose |
|------|---------|
| `Procfile` | Tells Render how to start your app |
| `runtime.txt` | Specifies Python version (3.13.0) |
| `render.yaml` | Alternative config file |
| `build.sh` | Build script (migrations, static files) |
| `.env` | Local environment variables |
| `requirements.txt` | Updated with production packages |

---

## 🔗 YOUR DEPLOYED LINKS

After deployment, your app will be live at:

- **Main URL:** `https://casanova-fashion.onrender.com/`
- **Store:** `https://casanova-fashion.onrender.com/`
- **Products:** `https://casanova-fashion.onrender.com/product/1/`
- **Cart:** `https://casanova-fashion.onrender.com/cart/`
- **Admin:** `https://casanova-fashion.onrender.com/admin/`
- **Features:** `https://casanova-fashion.onrender.com/features/`
- **3D Card:** `https://casanova-fashion.onrender.com/lanyard/`

---

## 📱 ACCESS FROM PHONE

Once deployed on Render:
1. Visit: `https://casanova-fashion.onrender.com/`
2. Works on any device (desktop, tablet, phone)
3. No need for your computer to be running!
4. Accessible anytime, anywhere

---

## ⚙️ WHAT'S INCLUDED

✅ Django 5.2+ configuration  
✅ Gunicorn production server  
✅ WhiteNoise for static files  
✅ Security settings enabled  
✅ Database migrations automated  
✅ Environment variable management  
✅ Product detail pages  
✅ Cart functionality  
✅ Admin panel  

---

## 🐛 TROUBLESHOOTING

### App won't start?
- Check Build Logs in Render Dashboard
- Verify all environment variables are set
- Ensure `Procfile` has correct syntax

### Static files not loading?
- Run: `python manage.py collectstatic --noinput`
- WhiteNoise will serve them automatically

### Database errors?
- Check if migrations ran: `python manage.py showmigrations`
- Render should auto-run migrations via `build.sh`

### Payment APIs not working?
- Add your test keys to environment variables
- Stripe & Razorpay need different keys for production

---

## 📚 DETAILED GUIDES

For more information, see:
- `DEPLOYMENT_SUMMARY.md` - Step-by-step guide
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
- `RENDER_DEPLOYMENT.md` - Render-specific instructions

---

## 💡 TIPS

1. **Free Tier**: App sleeps after 15 minutes. Great for demos!
2. **Paid Tier**: $7/month for always-on hosting
3. **Custom Domain**: Add your own domain in Render settings
4. **GitHub Auto-Deploy**: Any push to main branch redeploys automatically

---

## 🎉 YOU'RE READY!

Your Casanova Fashion Point is production-ready!

**Next Step:** Follow the Quick Start above and deploy! 🚀

Questions? Check Render docs: https://render.com/docs

---

**Happy Deploying!** 🎊
