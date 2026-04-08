# RetinaIQ

Explainable Deep Learning Framework for Automated Diabetic Retinopathy Screening.

## Quick Start (Local Deployment)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RetinaIQ-main
   ```

2. **Run setup script**
   ```bash
   .\setup.ps1
   ```
   This will:
   - Check Python 3.11 compatibility
   - Create virtual environment
   - Install all dependencies
   - Train the ML model (30-60 minutes)
   - Set up database schema

3. **Install system dependencies** (if not already installed):
   - PostgreSQL: https://postgresql.org/download/windows/
   - Redis: https://redis.io/download
   - MinIO: https://min.io/download#/windows
   - Node.js: https://nodejs.org

4. **Launch the application**
   ```bash
   .\launch.ps1
   ```

## Access Points
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- MinIO Console: http://localhost:9001

## Prerequisites
- Windows 10/11
- Python 3.11 (required for TensorFlow compatibility)
- PowerShell execution policy allowing scripts: `Set-ExecutionPolicy RemoteSigned`

## Project Structure
- `backend/`: FastAPI server with ML models
- `frontend/`: React application
- `data/`: Training dataset
- `setup.ps1`: Automated setup script
- `launch.ps1`: Application launcher

## Features
- Automated model training on startup
- Explainable AI with Grad-CAM and SHAP
- RESTful API with OpenAPI documentation
- React frontend for image upload and analysis
- PostgreSQL database with Alembic migrations
- Redis caching and Celery task queue
- MinIO object storage

## Medical Disclaimer
This output is AI-generated and must be reviewed by a qualified ophthalmologist before any clinical decision.
