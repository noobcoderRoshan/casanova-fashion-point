# ✅ PRE-DEPLOYMENT CHECKLIST

## Before You Deploy to Render, Verify Everything:

### Project Files
- [ ] `Procfile` exists in root
- [ ] `runtime.txt` exists in root
- [ ] `render.yaml` exists in root
- [ ] `build.sh` exists in root
- [ ] `.env` exists with all variables
- [ ] `requirements.txt` updated with all dependencies

### Code
- [ ] All views working locally (http://127.0.0.1:8000/)
- [ ] Product detail page works
- [ ] Cart functionality works
- [ ] Forms and validations work
- [ ] No console errors in browser

### Database
- [ ] Database migrations applied: `python manage.py migrate`
- [ ] Sample data loaded: `python seed_data.py`
- [ ] Admin account created: `python manage.py createsuperuser`

### Dependencies
- [ ] All packages in requirements.txt installed locally
- [ ] No missing imports or module errors
- [ ] Server runs without errors: `python manage.py runserver`

### Git Repository
- [ ] Repository is on GitHub
- [ ] All files committed (except `.venv/`, `db.sqlite3`)
- [ ] `.gitignore` includes necessary files
- [ ] Latest changes pushed to main branch

### Environment Variables Ready
- [ ] SECRET_KEY - Have a secure key ready
- [ ] DEBUG = false (for production)
- [ ] ALLOWED_HOSTS includes your Render domain
- [ ] Payment API keys ready (if needed)
- [ ] STRIPE_PUBLIC_KEY & STRIPE_SECRET_KEY ready
- [ ] RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET ready

### Render Account
- [ ] Render.com account created
- [ ] Connected to GitHub
- [ ] Ready to create web service

---

## Quick Pre-Deployment Test

Run this command locally to test the production server:

```bash
cd mens_fashion
python manage.py collectstatic --noinput
python manage.py runserver
```

Visit: http://127.0.0.1:8000/ and verify everything works

---

## Render Deployment Command Reference

If using Render CLI:

```bash
# Install Render CLI
npm i -g @render-com/cli

# Login to Render
render login

# Deploy
render deploy
```

---

**✅ Ready? Follow the steps in DEPLOYMENT_SUMMARY.md**
