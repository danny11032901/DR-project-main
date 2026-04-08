# RetinaIQ Setup Script
# Run this script to set up and launch the complete RetinaIQ project

Write-Host "=== RetinaIQ Project Setup ===" -ForegroundColor Green

# Check Python version
$pythonVersion = python --version 2>&1
Write-Host "Current Python version: $pythonVersion"

if ($pythonVersion -notmatch "3\.1[01]") {
    Write-Host "ERROR: Python 3.10 or 3.11 is required. Please install Python from https://python.org" -ForegroundColor Red
    Write-Host "Download: https://python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

# Create virtual environment
Write-Host "Creating virtual environment..."
python -m venv retinaiq_env

# Activate and install dependencies
Write-Host "Activating environment and installing dependencies..."
& "retinaiq_env\Scripts\activate"
python -m pip install --upgrade pip
pip install -r backend/requirements.txt

# Verify TensorFlow
Write-Host "Verifying TensorFlow installation..."
python -c "import tensorflow as tf; print('TensorFlow version:', tf.__version__)" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: TensorFlow installation failed" -ForegroundColor Red
    exit 1
}

# Check if model is trained
$modelPath = "backend/ml_models/retinaiq_efficientnetv2b3.h5"
if (Test-Path $modelPath) {
    Write-Host "Model already trained: $modelPath" -ForegroundColor Green
} else {
    Write-Host "Training model (this may take 30-60 minutes)..."
    cd backend
    python ml_models/train.py --dataset_path ../data --epochs 50 --batch_size 8
    cd ..
    if (Test-Path $modelPath) {
        Write-Host "Model training completed!" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Model training failed" -ForegroundColor Red
        exit 1
    }
}

# Setup database (assuming PostgreSQL is installed)
Write-Host "Setting up database..."
# Note: User needs to have PostgreSQL installed and running
cd backend
alembic upgrade head 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Database setup failed. Make sure PostgreSQL is installed and running." -ForegroundColor Yellow
}
cd ..

# Setup frontend
Write-Host "Setting up frontend..."
cd frontend
npm install
cd ..

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host "To launch the application, run: .\launch.ps1"
Write-Host ""
Write-Host "Required services to start manually:"
Write-Host "- PostgreSQL (database)"
Write-Host "- Redis (caching)"
Write-Host "- MinIO (storage)"
Write-Host ""
Write-Host "Access points:"
Write-Host "- Frontend: http://localhost:3000"
Write-Host "- Backend: http://localhost:8000"
Write-Host "- API Docs: http://localhost:8000/docs"