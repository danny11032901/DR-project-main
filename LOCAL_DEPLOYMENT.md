# Local Deployment Guide for RetinaIQ (Without Docker)

This guide allows you to run RetinaIQ locally without Docker, while keeping Docker files intact for containerized deployment.

## Prerequisites

### 1. Python Environment
- **Python Version**: 3.8-3.12 (TensorFlow doesn't support 3.13+)
- Install Python from https://python.org if needed
- Create virtual environment: `python -m venv venv`
- Activate: `venv\Scripts\activate` (Windows)

### 2. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 3. PostgreSQL Database
- Download from https://postgresql.org
- Install and start PostgreSQL service
- Create database and user:
```sql
CREATE DATABASE retinaiq;
CREATE USER retinaiq_user WITH PASSWORD 'replace-with-strong-password';
GRANT ALL PRIVILEGES ON DATABASE retinaiq TO retinaiq_user;
```

### 4. Redis
- Download from https://redis.io/download
- Extract and run: `redis-server.exe`

### 5. MinIO (Object Storage)
- Download from https://min.io/download
- Run: `minio.exe server C:\minio-data` (create data folder)
- Access console at http://localhost:9001

### 6. Node.js (for Frontend)
- Download from https://nodejs.org
- Install npm

## Configuration

1. Copy `.env.example` to `.env`
2. Update `.env` for local services:
```
DB_HOST=localhost
REDIS_URL=redis://localhost:6379/0
STORAGE_BACKEND=minio
MINIO_ENDPOINT=localhost:9000
# Update passwords and other settings
```

## Running the Application

### 1. Database Setup
```bash
cd backend
alembic upgrade head
```

### 2. Backend (in one terminal)
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend (in another terminal)
```bash
cd frontend
npm install
npm run dev
```

### 4. Celery Worker (optional, for async tasks)
```bash
cd backend
celery -A app.tasks.celery_app worker --loglevel=info
```

## Training the Model

To train the model locally:
```bash
cd backend
python ml_models/train.py --dataset_path ../data --epochs 50 --batch_size 8
```

## Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- MinIO Console: http://localhost:9001

## Troubleshooting
- If TensorFlow fails: Ensure Python 3.8-3.12
- Database connection: Verify PostgreSQL is running
- Port conflicts: Change ports in .env if needed