# Render Deployment Cheat Sheet

## ⚡ Quick Reference

### One-Line Deploy
```bash
git push origin main && echo "Go to render.com and deploy!"
```

### Essential Commands

```bash
# Test locally before deploying
pytest backend/tests/ -v

# Lint code
ruff check .

# Type check
mypy backend/

# Build Docker images (verify)
docker build -f backend/Dockerfile -t test:backend .
docker build -f frontend/Dockerfile -t test:frontend .

# Generate SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Render URLs (After Deployed)
```
Frontend:  https://retinaiq-frontend.onrender.com
Backend:   https://retinaiq-backend.onrender.com
API Docs:  https://retinaiq-backend.onrender.com/docs
Health:    https://retinaiq-backend.onrender.com/api/v1/health
```

### Environment Variables to Set
```
SECRET_KEY=<generated-string>
AWS_S3_BUCKET=<optional>
AWS_ACCESS_KEY_ID=<optional>
AWS_SECRET_ACCESS_KEY=<optional>
```

### File Locations
```
render.yaml              ← Main deployment config
.env.render             ← Production env template
RENDER_QUICKSTART.md    ← 5-min guide
RENDER_DEPLOYMENT.md    ← Full guide
backend/Dockerfile      ← Backend container
frontend/Dockerfile     ← Frontend container
.dockerignore          ← Docker optimization
```

### Deployment Stages

| Step | What | Time |
|------|------|------|
| 1 | `git push` | 1 min |
| 2 | GitHub sync | 1 min |
| 3 | Render detect | 2 min |
| 4 | Build backend | 3-5 min |
| 5 | Build frontend | 2-3 min |
| 6 | Create databases | 2 min |
| 7 | Migrations run | 1 min |
| 8 | Services start | 2 min |
| **Total** | | **~15-20 min** |

### Accessing Logs
```
Render Dashboard → Select Service → Logs
```

### Redeploying
```
Render Dashboard → Select Service → Redeploy
```

### Environment Variable Setup
1. go to render.com
2. Click service name
3. Settings tab
4. Environment section
5. Add variables
6. Save & redeploy

### Troubleshooting

| Problem | Solution |
|---------|----------|
| App won't start | Check logs in Render dashboard |
| Blank page | Press F12, check console errors |
| Can't login | Check SECRET_KEY in environment |
| Models missing | Set AWS_S3_BUCKET or use placeholder |
| Database error | Verify DATABASE_URL, run migrations |
| Port already in use | Render handles this automatically |

### Health Check
```bash
# Verify backend is healthy
curl https://retinaiq-backend.onrender.com/api/v1/health
```

### Monitor Resources
```
Render Dashboard → Service → Metrics tab
```

### View Database
```
Render Dashboard → PostgreSQL → Browser
```

### Backup Database
```
Render Dashboard → PostgreSQL → Backups
Provides automatic daily backups
```

### Connect to Database (Advanced)
```bash
psql postgresql://user:pass@host:5432/dbname
```

### SSH into Service (if needed)
```
Not directly available on Render's free tier
Use web shell in Dashboard instead
```

### Restart Service
```
Render Dashboard → Service → Restart
```

### Scale Service (Paid only)
```
Render Dashboard → Service → Plan
```

### Custom Domain Setup
```
1. Buy domain (GoDaddy, Namecheap, etc.)
2. Render Dashboard → Settings
3. Add Custom Domain
4. Update DNS records (instructions provided)
5. Wait 15-30 min for propagation
```

### Disable Auto-Deploy
```
Render Dashboard → Service → Auto-Deploy
Toggle off if needed
```

### View API Documentation
```
https://retinaiq-backend.onrender.com/docs
```

### Test API Endpoint
```bash
curl -X GET https://retinaiq-backend.onrender.com/api/v1/health
```

### Update Single Environment Variable
```
1. Render Dashboard → Service → Settings
2. Find variable → Edit
3. Save & Redeploy
```

### Delete Service (Caution!)
```
1. Render Dashboard → Service → Settings
2. Scroll to bottom
3. Delete Service
⚠️ Cannot be undone!
```

---

## 🔐 Security Checklist

- [ ] SECRET_KEY is strong & unique
- [ ] Database password is secure
- [ ] No secrets committed to git
- [ ] HTTPS enabled (automatic)
- [ ] Debug mode is off
- [ ] CORS configured properly
- [ ] Rate limiting enabled

---

## 📊 Service Statuses to Check

### All Green ✅
- Frontend: Running
- Backend: Running  
- PostgreSQL: Available
- Redis: Available
- Celery Worker: Running

### Investigation Needed ⚠️
- Any service in yellow
- Any service in red status
- High CPU/memory usage

---

## 💡 Pro Tips

1. **Keep render.yaml updated** - it's your source of truth
2. **Check logs first** - saves debugging time
3. **Commit early, push often** - easier to rollback
4. **Monitor first 24 hours** - catch issues early
5. **Keep backups** - Render does this automatically
6. **Use staging environment** - test before production
7. **Document your setup** - helps during emergencies

---

## 🆘 Emergency Contacts

**Problem Solving Order:**
1. Check Render Dashboard logs
2. Read RENDER_DEPLOYMENT.md
3. Check GitHub Actions for recent changes
4. Render support: https://render.com/support
5. RetinaIQ issues: GitHub Issues

---

## 📱 Mobile Friendly

This app is responsive and works on:
- ✅ Desktop (full features)
- ✅ Tablet (optimized)
- ✅ Mobile (responsive UI)

Test on https://retinaiq-frontend.onrender.com on mobile

---

**Last Updated**: April 2026
**Render Docs**: https://render.com/docs
**Status**: Production Ready ✅
