# RetinaIQ Launch Script
# Run this after setup.ps1 to start the application

Write-Host "=== RetinaIQ Application Launch ===" -ForegroundColor Green

# Check if setup was completed
# Model check bypassed for development
# $modelPath = "backend/ml_models/retinaiq_efficientnetv2b3.h5"
# if (-not (Test-Path $modelPath)) {
#     Write-Host "ERROR: Model not found. Run .\setup.ps1 first" -ForegroundColor Red
#     exit 1
# }

# Activate environment
Write-Host "Activating virtual environment..."
& "retinaiq_env\Scripts\activate"

# Start backend in background
Write-Host "Starting backend server..."
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000" -WorkingDirectory "backend"

# Start frontend in background
Write-Host "Starting frontend..."
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "frontend"

# Optional: Start Celery worker
Write-Host "Starting Celery worker..."
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m", "celery", "-A", "app.tasks.celery_app", "worker", "--loglevel=info" -WorkingDirectory "backend"

Write-Host ""
Write-Host "=== Application Started! ===" -ForegroundColor Green
Write-Host "Access points:"
Write-Host "- Frontend: http://localhost:3000"
Write-Host "- Backend: http://localhost:8000"
Write-Host "- API Docs: http://localhost:8000/docs"
Write-Host ""
Write-Host "Press Ctrl+C to stop all services"
Write-Host ""

# Keep script running to show logs
Read-Host "Press Enter to stop all services"

# Stop processes (this is basic, may need improvement)
Write-Host "Stopping services..."
Stop-Process -Name "python" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue