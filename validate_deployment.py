#!/usr/bin/env python3
"""
Pre-deployment validation script.
Run this before pushing to GitHub to catch issues early.
"""

import os
import sys
import json
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def check(condition, message, critical=False):
    """Print check result."""
    status = f"{Colors.GREEN}✓{Colors.END}" if condition else f"{Colors.RED}✗{Colors.END}"
    level = "CRITICAL" if (not condition and critical) else "WARNING" if not condition else "OK"
    print(f"{status} {message}")
    return condition

def main():
    """Run all validation checks."""
    print(f"\n{Colors.BLUE}=== RetinaIQ Render Deployment Validation ==={Colors.END}\n")
    
    issues = []
    warnings = []
    root = Path(".")
    
    # 1. Check essential files exist
    print(f"{Colors.BLUE}📁 Checking essential files...{Colors.END}")
    essential_files = [
        "render.yaml",
        ".dockerignore",
        ".env.render",
        "backend/Dockerfile",
        "frontend/Dockerfile",
        "backend/scripts/download_models.py",
        "RENDER_DEPLOYMENT.md",
        "RENDER_QUICKSTART.md",
    ]
    
    for file in essential_files:
        exists = (root / file).exists()
        if not check(exists, f"  {file}", critical=True):
            issues.append(f"Missing: {file}")
    
    # 2. Check render.yaml structure
    print(f"\n{Colors.BLUE}⚙️  Checking render.yaml...{Colors.END}")
    render_yaml = root / "render.yaml"
    if render_yaml.exists():
        with open(render_yaml) as f:
            content = f.read()
            check("services:" in content, "  Contains services definition")
            check("retinaiq-backend" in content, "  Backend service defined")
            check("retinaiq-frontend" in content, "  Frontend service defined")
    
    # 3. Check backend requirements
    print(f"\n{Colors.BLUE}📦 Checking backend requirements...{Colors.END}")
    req_file = root / "backend" / "requirements.txt"
    if req_file.exists():
        with open(req_file) as f:
            req_content = f.read()
            check("fastapi" in req_content, "  FastAPI included")
            check("uvicorn" in req_content, "  Uvicorn included")
            check("gunicorn" in req_content, "  Gunicorn included (for production)")
            check("alembic" in req_content, "  Alembic included (for migrations)")
            if "boto3" not in req_content:
                warnings.append("boto3 not in requirements.txt (needed for S3)")
    
    # 4. Check environment files
    print(f"\n{Colors.BLUE}🔐 Checking environment configuration...{Colors.END}")
    env_render = root / ".env.render"
    if env_render.exists():
        with open(env_render) as f:
            env_content = f.read()
            check("SECRET_KEY=" in env_content, "  SECRET_KEY template present")
            check("AWS_S3_BUCKET=" in env_content, "  AWS_S3_BUCKET template present")
            check("AUTO_TRAIN_IF_MISSING=false" in env_content, "  Auto-train disabled (good!)")
            if "your-strong-password" in env_content:
                warnings.append("Placeholder passwords in .env.render (remember to replace)")
    
    # 5. Check Dockerfiles
    print(f"\n{Colors.BLUE}🐳 Checking Dockerfiles...{Colors.END}")
    backend_df = root / "backend" / "Dockerfile"
    if backend_df.exists():
        with open(backend_df) as f:
            df_content = f.read()
            check("FROM python:3.11" in df_content, "  Python 3.11 base image")
            check("HEALTHCHECK" in df_content, "  Health check defined")
            check("alembic upgrade head" in df_content, "  Migrations in CMD")
    
    # 6. Check frontend
    print(f"\n{Colors.BLUE}⚛️  Checking frontend...{Colors.END}")
    package_json = root / "frontend" / "package.json"
    if package_json.exists():
        with open(package_json) as f:
            pkg = json.load(f)
            check("build" in pkg.get("scripts", {}), "  Build script present")
            check("dev" in pkg.get("scripts", {}), "  Dev script present")
    
    # 7. Check git status
    print(f"\n{Colors.BLUE}📝 Checking git status...{Colors.END}")
    os.system("git status --short > /tmp/git_status.txt 2>/dev/null")
    with open("/tmp/git_status.txt") as f:
        status = f.read()
        untracked = [l for l in status.split("\n") if l.startswith("?? ")]
        if untracked:
            warnings.append(f"Untracked files (will need to commit): {len(untracked)} files")
    
    # 8. Check Python version
    print(f"\n{Colors.BLUE}🐍 Checking Python...{Colors.END}")
    python_version = sys.version.split()[0]
    required = "3.11" in python_version or "3.12" in python_version
    check(required, f"  Python {python_version} (requires 3.11/3.12)")
    
    # 9. Check .dockerignore
    print(f"\n{Colors.BLUE}📦 Checking .dockerignore...{Colors.END}")
    dockerignore = root / ".dockerignore"
    if dockerignore.exists():
        with open(dockerignore) as f:
            ignore_content = f.read()
            check("__pycache__" in ignore_content, "  Python cache excluded")
            check("node_modules" in ignore_content, "  Node modules excluded")
            check(".git" in ignore_content, "  .git excluded")
    
    # 10. Summary
    print(f"\n{Colors.BLUE}=== Summary ==={Colors.END}\n")
    
    if issues:
        print(f"{Colors.RED}❌ Critical Issues: {len(issues)}{Colors.END}")
        for issue in issues:
            print(f"   - {issue}")
    
    if warnings:
        print(f"{Colors.YELLOW}⚠️  Warnings: {len(warnings)}{Colors.END}")
        for warning in warnings:
            print(f"   - {warning}")
    
    if not issues:
        print(f"{Colors.GREEN}✅ All checks passed! Ready to deploy.{Colors.END}")
        return 0
    else:
        print(f"\n{Colors.RED}❌ Please fix critical issues before deploying.{Colors.END}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
