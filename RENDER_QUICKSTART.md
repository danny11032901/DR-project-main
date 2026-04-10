# Quick Start: Deploy to Render in 5 Minutes

This is the **TL;DR** - just 3 steps!

## ✅ Step 1: Commit & Push to GitHub

```bash
git add .
git commit -m "Add Render deployment"
git push origin main
```

## ✅ Step 2: Create Render Blueprint

1. Go to https://render.com (sign up with GitHub)
2. Click **"New +"** → **"Blueprint"**
3. Select your GitHub repository
4. Click **"Deploy"** ✨

That's it! Render does everything automatically:
- ✅ Creates PostgreSQL database
- ✅ Creates Redis cache
- ✅ Builds & deploys backend
- ✅ Builds & deploys frontend
- ✅ Starts Celery worker
- ✅ Runs database migrations
- ✅ Sets up ML models

## ✅ Step 3: Set Environment Variables

1. Go to Render Dashboard
2. Click **retinaiq-backend** service
3. Go to **Settings** → **Environment**
4. Add these variables:

```
SECRET_KEY=<copy from .env file or generate new>
AWS_S3_BUCKET=<your-s3-bucket-if-using>
AWS_ACCESS_KEY_ID=<your-aws-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
```

**Done! 🎉**

Your app is now live at:
- **Frontend**: https://retinaiq-frontend.onrender.com
- **Backend**: https://retinaiq-backend.onrender.com
- **API Docs**: https://retinaiq-backend.onrender.com/docs

## What Got Deployed?

```
Frontend (React)
    ↓
Backend (FastAPI) 
    ↓
PostgreSQL + Redis
    ↓
Celery Worker for ML Tasks
```

## Troubleshooting

**App won't start?**
→ Check logs in Render Dashboard → Service → Logs

**Blank page in frontend?**
→ Open browser DevTools (F12) → Check console for errors

**ML models not found?**
→ Check if AWS_S3_BUCKET is set correctly

---

For detailed documentation, see [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)

Need help? See the full guide! 📖
