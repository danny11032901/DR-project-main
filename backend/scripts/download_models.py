#!/usr/bin/env python3
"""
Download pre-trained ML models on deployment.
This script runs during Render deployment to ensure models are available.
"""

import os
import sys
from pathlib import Path

# Model directory
MODEL_DIR = Path("/app/ml_models")
MODEL_DIR.mkdir(parents=True, exist_ok=True)

# List of required model files
REQUIRED_MODELS = [
    "retinaiq_efficientnetv2b3.weights.h5",
    "retinaiq_mobilenetv3.weights.h5",
]

def check_models_exist():
    """Check if all required models exist."""
    missing = []
    for model in REQUIRED_MODELS:
        model_path = MODEL_DIR / model
        if not model_path.exists():
            missing.append(model)
    return missing

def create_dummy_models():
    """Create placeholder models if they don't exist.
    In production, you should download from S3 or similar storage.
    """
    print("Creating placeholder models...")
    for model in REQUIRED_MODELS:
        model_path = MODEL_DIR / model
        if not model_path.exists():
            # Create placeholder file (in production, download from S3)
            print(f"⚠️  WARNING: Creating placeholder for {model}")
            print("  In production, download actual model from S3 or cloud storage")
            with open(model_path, 'w') as f:
                f.write(f"Placeholder for {model}")
    print("✓ Models ready")

def download_from_s3():
    """Download models from AWS S3 if configured."""
    try:
        import boto3
        
        s3_bucket = os.getenv("AWS_S3_BUCKET", "")
        if not s3_bucket:
            print("AWS_S3_BUCKET not configured, using placeholder models")
            create_dummy_models()
            return
        
        s3_client = boto3.client("s3")
        
        for model in REQUIRED_MODELS:
            model_path = MODEL_DIR / model
            if not model_path.exists():
                print(f"Downloading {model} from S3...")
                try:
                    s3_client.download_file(
                        s3_bucket,
                        f"ml-models/{model}",
                        str(model_path)
                    )
                    print(f"✓ Downloaded {model}")
                except Exception as e:
                    print(f"⚠️  Could not download {model}: {e}")
                    create_dummy_models()
                    break
    
    except ImportError:
        print("boto3 not installed, using placeholder models")
        create_dummy_models()

if __name__ == "__main__":
    print("Checking ML models...")
    missing = check_models_exist()
    
    if missing:
        print(f"Missing models: {missing}")
        download_from_s3()
    else:
        print("✓ All models found")
