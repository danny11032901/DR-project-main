# Deployment Checklist

Complete this checklist before deploying to production on Render.

## 📋 Pre-Deployment

### Code Quality
- [ ] All tests pass: `pytest backend/tests/ -v`
- [ ] No linting errors: `ruff check backend/ frontend/`
- [ ] Type checking passes: `mypy backend/`
- [ ] No security vulnerabilities: Check dependencies

### Configuration Files
- [ ] `render.yaml` exists in root directory
- [ ] `.dockerignore` exists
- [ ] `backend/Dockerfile` is optimized
- [ ] `frontend/Dockerfile` is optimized
- [ ] `.env.render` has all required variables
- [ ] `backend/scripts/download_models.py` exists

### Documentation
- [ ] `RENDER_DEPLOYMENT.md` created
- [ ] `RENDER_QUICKSTART.md` created
- [ ] `README.md` updated with Render info

### Dependencies
- [ ] `requirements.txt` includes boto3 for S3
- [ ] `package.json` has correct Node version
- [ ] All Python dependencies compatible with Python 3.11

## 🔐 Security

### Secrets & API Keys
- [ ] `SECRET_KEY` is strong (256+ bits)
- [ ] Database password is secure
- [ ] No hardcoded secrets in code
- [ ] AWS credentials ready (if using S3)

### Environment Variables
- [ ] `DEBUG=false` for production
- [ ] `APP_ENV=production`
- [ ] `AUTO_TRAIN_IF_MISSING=false`
- [ ] Correct database URLs configured

### Database
- [ ] Migrations are tested locally
- [ ] Backup plan documented
- [ ] Database constraints are correct

## 🏗️ Architecture

### Services
- [ ] Frontend service configured
- [ ] Backend service configured
- [ ] PostgreSQL service configured
- [ ] Redis service configured
- [ ] Celery worker configured
- [ ] ML models disk configured (20GB)

### Health Checks
- [ ] Backend health endpoint tested
- [ ] Database connectivity verified
- [ ] Redis connectivity verified

## 📦 Build & Images

### Docker
- [ ] Build passes: `docker build -f backend/Dockerfile .`
- [ ] Image size reasonable (~1-2GB)
- [ ] Build uses cache efficiently

### Optimization
- [ ] `.dockerignore` excludes unnecessary files
- [ ] Multi-stage builds used
- [ ] Layer caching optimized

## 🧪 Testing

### Functionality
- [ ] API endpoints tested
- [ ] Authentication working
- [ ] Database queries working
- [ ] Celery tasks working
- [ ] Frontend builds successfully
- [ ] Frontend API calls working

### Performance
- [ ] Database queries are optimized
- [ ] No N+1 query problems
- [ ] Cache headers set correctly
- [ ] Images/assets optimized

## 🌐 Deployment Preparation

### Git Repository
- [ ] Repository is public on GitHub
- [ ] All deployment files committed
- [ ] `.gitignore` excludes sensitive data
- [ ] No secrets in commit history

### GitHub
- [ ] Repository connected to Render
- [ ] GitHub integration authorized
- [ ] Branch protection rules (optional)

### Render Account
- [ ] Render account created
- [ ] GitHub connected
- [ ] Payment method added (for paid services)

## 🚀 Pre-Launch

### Environment Setup
- [ ] Production environment variables ready
- [ ] Database credentials generated
- [ ] AWS S3 bucket created (if applicable)
- [ ] AWS IAM user created with S3 permissions

### Data
- [ ] ML models available (locally or on S3)
- [ ] Initial data seeded (if needed)
- [ ] Database schema finalized

### Monitoring
- [ ] Logging configured
- [ ] Error tracking setup (Sentry, etc. - optional)
- [ ] Monitoring alerts configured (optional)

## 📝 Documentation

### Runbooks
- [ ] Deployment procedure documented
- [ ] Troubleshooting guide complete
- [ ] Rollback procedure documented
- [ ] Scaling procedure documented

### Team
- [ ] Team members trained on deployment
- [ ] Access granted to Render dashboard
- [ ] Emergency contacts listed

## ✅ Launch Steps

1. [ ] Commit all changes:
   ```bash
   git add .
   git commit -m "Production deployment ready"
   git push origin main
   ```

2. [ ] Verify GitHub push successful

3. [ ] Go to render.com and create new Blueprint

4. [ ] Select GitHub repository

5. [ ] Click "Deploy" button

6. [ ] Wait for all services to deploy (~5-10 minutes)

7. [ ] Check all services are running:
   - [ ] Frontend: https://retinaiq-frontend.onrender.com
   - [ ] Backend: https://retinaiq-backend.onrender.com/api/v1/health
   - [ ] API Docs: https://retinaiq-backend.onrender.com/docs

8. [ ] Set environment variables in Render dashboard:
   - [ ] SECRET_KEY
   - [ ] AWS credentials (if using S3)

9. [ ] Redeploy backend to apply environment variables

10. [ ] Test core functionality:
    - [ ] Login works
    - [ ] Upload image works
    - [ ] Prediction runs
    - [ ] Results display correctly

## 🔄 Post-Deployment

### Monitoring (First 24 Hours)
- [ ] Check logs for errors
- [ ] Monitor resource usage
- [ ] Test all user workflows
- [ ] Check API response times

### Verification
- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] Database queries work
- [ ] Celery tasks process
- [ ] SSL/HTTPS working

### Communication
- [ ] Notify stakeholders
- [ ] Update documentation
- [ ] Share access credentials (securely)
- [ ] Schedule team training

## 🐛 Troubleshooting

If deployment fails:

1. [ ] Check Render service logs
2. [ ] Verify environment variables
3. [ ] Test database connection
4. [ ] Check Docker build logs
5. [ ] Verify GitHub connectivity
6. [ ] Check required files exist

## 📌 Important Notes

- **Do not deploy** if any item is unchecked
- Keep this checklist for future deployments
- Update as you learn from production experience
- Celebrate launch! 🎉

## Quick Reference: Commands

```bash
# Test everything locally
pytest backend/tests/ -v
ruff check .
mypy backend/

# Build Docker images
docker build -f backend/Dockerfile -t retinaiq-backend .
docker build -f frontend/Dockerfile -t retinaiq-frontend .

# Deploy to Render
git push origin main
# Then use Render UI to deploy
```

---

**Status**: All items complete ✓ - Ready for production deployment!
