# RetinaIQ Render Deployment Guide

Complete step-by-step guide to deploy RetinaIQ to Render with zero additional configuration.

## Prerequisites

- GitHub account with repository access
- Render account (free tier available at https://render.com)
- AWS S3 bucket for storing ML models (optional, uses placeholder models if not configured)
- Custom domain (optional)

## Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

Ensure these files are committed:
- `render.yaml` - Main Render configuration
- `.dockerignore` - Docker build optimizations
- `backend/Dockerfile` - Updated backend Dockerfile
- `backend/scripts/download_models.py` - Model download script
- `.env.render` - Production environment template

### 2. Create Render Account & Connect GitHub

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Blueprint" 
4. Select your GitHub repository
5. Authorize Render to access your repo

### 3. Deploy from Blueprint

1. Make sure `render.yaml` is in the root directory
2. Click "Deploy" 
3. Render will automatically:
   - Create PostgreSQL database
   - Create Redis instance
   - Build and deploy backend
   - Build and deploy frontend
   - Start Celery worker
   - Run database migrations
   - Download/prepare ML models

### 4. Configure Environment Variables

In Render Dashboard:

1. Go to **Settings** for `retinaiq-backend`
2. Scroll to **Environment**
3. Add these via Render's UI or edit `.env.render`:

```
SECRET_KEY=<generate-random-256-bit-string>
AWS_S3_BUCKET=<your-s3-bucket-name>
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
```

**Generate SECRET_KEY**:
```python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 5. Verify Deployment

Once deployed:

- **Frontend**: https://retinaiq-frontend.onrender.com
- **Backend API**: https://retinaiq-backend.onrender.com
- **API Docs**: https://retinaiq-backend.onrender.com/docs
- **Health Check**: https://retinaiq-backend.onrender.com/api/v1/health

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Render Services                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Frontend (Nginx)           Backend (FastAPI)  │
│  Port: 80                   Port: 8000         │
│                             + Celery Worker    │
│                                                 │
│  PostgreSQL (Managed)       Redis (Managed)    │
│  10GB Disk                  5GB Disk           │
│                                                 │
│  ML Models Disk (20GB)                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Services Overview

### Web Services
- **retinaiq-frontend**: React app served via Nginx (Port 80)
- **retinaiq-backend**: FastAPI server (Port 8000)

### Databases
- **PostgreSQL**: Primary database (managed by Render)
- **Redis**: Cache and message broker (managed by Render)

### Workers
- **Celery Worker**: Background task processor for ML inference

### Storage
- **ML Models Disk**: 20GB persistent storage for ML model weights
- **S3 Integration**: Optional AWS S3 for image storage and backups

## Important Notes

### ML Models

The project downloads models during deployment:

1. **Placeholder Mode** (Default):
   - Creates placeholder model files
   - Good for testing infrastructure
   - Ensures app starts without models

2. **S3 Mode** (Production):
   - Set `AWS_S3_BUCKET` environment variable
   - Uploads your model files to S3
   - Render downloads them during preDeployCommand

**To use real models on production**:
```bash
# Upload models to your S3 bucket
aws s3 cp backend/ml_models/ s3://your-bucket/ml-models/ --recursive

# Set environment variables in Render dashboard:
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Database Migrations

Migrations run automatically during deployment via:
```
alembic upgrade head
```

No manual database setup needed!

### Auto-Training Disabled

`AUTO_TRAIN_IF_MISSING=false` by default on Render.

To enable model training post-deployment (not recommended for free tier):
1. Set `AUTO_TRAIN_IF_MISSING=true` in environment
2. Increase backend memory/CPU
3. Be prepared for longer startup times

## Troubleshooting

### Backend won't start
1. Check logs: Render Dashboard → Service → Logs
2. Verify database migrations: `alembic upgrade head`
3. Ensure database connection string is correct

### Frontend shows blank page
1. Check browser console for CORS errors
2. Verify `FRONTEND_URL` in backend environment
3. Check `VITE_API_URL` in frontend environment

### Models not loading
1. Check if S3 is configured
2. Verify IAM permissions for S3 bucket
3. Check disk space: `df -h /app/ml_models`

### Celery worker stuck
1. Restart in Render Dashboard
2. Check Redis connection
3. Monitor logs for errors

### Database connection errors
1. Verify PostgreSQL service is running
2. Check DATABASE_URL in environment
3. Run migrations manually: `alembic upgrade head`

## Monitoring & Logs

### Access Logs
Render Dashboard → Service → Logs

### Real-time Monitoring
Render Dashboard → Metrics tab

### Database Stats
Render Dashboard → PostgreSQL → Overview

## Scaling Options

### Free Tier (Limited)
- Includes: Services, PostgreSQL, Redis
- 0.5 CPU, 512MB RAM per service
- Suitable for testing/demo

### Paid Tier
- Dedicated resources
- More CPU/RAM
- Faster deployments
- Priority support

## Cost Estimation (August 2024)

| Component | Free Tier | Paid Tier |
|-----------|-----------|-----------|
| Frontend | Included | $7/month |
| Backend | Included | $7/month |
| Celery Worker | Included | $7/month |
| PostgreSQL | Free | $15/month |
| Redis | Free | $15/month |
| Disk Storage | Free | Included |
| **Total** | **Free** | **~$50/month** |

## SSL/HTTPS

Included automatically! Render provides free SSL certificates.

## Custom Domain

To use custom domain:
1. Render Dashboard → Settings
2. Add custom domain
3. Update CNAME/A records with your DNS provider

## Continuous Deployment

Push to GitHub → Render automatically redeploys!

## Rollback

1. Render Dashboard → Deployments
2. Select previous deployment
3. Click "Redeploy"

## Environment Comparison

| Aspect | Local | Render |
|--------|-------|--------|
| Setup | Manual (30 min) | Automatic |
| Database | PostgreSQL local | Managed PostgreSQL |
| Redis | Local Redis | Managed Redis |
| Models | Local disk | S3 + local disk |
| Storage | MinIO | AWS S3 |
| Cost | Free (+ hardware) | Free/Paid plans |
| Performance | Variable | Consistent |

## Advanced Configuration

### Custom Domains
Edit `render.yaml`:
```yaml
routes:
  - type: http
    source: example.com
```

### Regional Deployment
Change in `render.yaml`:
```yaml
region: toronto  # or london, singapore, etc.
```

### Database Backups
Render automatically backs up PostgreSQL daily.
Access in Dashboard → PostgreSQL → Backups

## Support

- Render Docs: https://render.com/docs
- RetinaIQ Issues: Check GitHub
- Community: Render Discord

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Create Render account
3. ✅ Deploy blueprint
4. ✅ Configure environment variables
5. ✅ Verify all services healthy
6. ✅ Test API endpoints
7. ✅ Set up monitoring
8. ✅ Add custom domain (optional)
9. ✅ Configure S3 models (optional)
10. ✅ Share with stakeholders!

---

**Deployment Status**: Ready to deploy! 🚀

All infrastructure is now containerized and deployment-ready.
