#!/bin/bash

# 🚀 Vercel + Railway Deployment Script
# Deploys frontend to Vercel, backend to Railway

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Check dependencies
check_dependencies() {
    print_header "🔍 CHECKING DEPENDENCIES"
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI not found"
        echo "Install with: npm i -g vercel"
        exit 1
    fi
    
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI not found"
        echo "Install with: npm i -g @railway/cli"
        exit 1
    fi
    
    print_success "All dependencies found"
}

# Deploy backend to Railway
deploy_backend() {
    print_header "🖥️ DEPLOYING BACKEND TO RAILWAY"
    
    # Create backend-only directory
    mkdir -p .deploy/backend
    
    # Copy backend files
    cp -r api/ .deploy/backend/
    cp -r utils/ .deploy/backend/ 2>/dev/null || true
    cp -r data/ .deploy/backend/ 2>/dev/null || true
    cp requirements.txt .deploy/backend/
    cp *.py .deploy/backend/ 2>/dev/null || true
    
    # Create backend Dockerfile
    cat > .deploy/backend/Dockerfile << 'EOF'
FROM python:3.11-slim

RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONPATH=/app
EXPOSE 8000

CMD ["python", "api/main.py"]
EOF

    cd .deploy/backend
    
    # Initialize Railway project for backend
    railway login
    railway init
    
    # Set environment variables
    railway variables set NODE_ENV=production
    railway variables set PYTHONPATH=/app
    railway variables set DATABASE_URL="sqlite:///./finance.db"
    railway variables set CORS_ORIGINS="*"
    
    # Deploy
    railway up --detach
    
    # Get backend URL
    BACKEND_URL=$(railway domain 2>/dev/null || echo "")
    cd ../..
    
    if [ -n "$BACKEND_URL" ]; then
        print_success "Backend deployed to: https://$BACKEND_URL"
        echo "https://$BACKEND_URL" > .deploy/backend_url.txt
    else
        print_error "Failed to get backend URL"
        exit 1
    fi
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_header "🌐 DEPLOYING FRONTEND TO VERCEL"
    
    # Read backend URL
    if [ -f ".deploy/backend_url.txt" ]; then
        BACKEND_URL=$(cat .deploy/backend_url.txt)
        print_status "Using backend URL: $BACKEND_URL"
    else
        print_error "Backend URL not found"
        exit 1
    fi
    
    # Login to Vercel
    vercel login
    
    # Set environment variables for Vercel
    vercel env add NEXT_PUBLIC_API_URL production <<< "$BACKEND_URL"
    vercel env add NEXT_PUBLIC_APP_URL production <<< "auto"
    
    # Deploy to Vercel
    vercel --prod --yes
    
    print_success "Frontend deployed to Vercel"
}

# Update CORS settings
update_cors() {
    print_header "🔧 UPDATING CORS SETTINGS"
    
    FRONTEND_URL=$(vercel ls | grep "https://" | head -1 | awk '{print $2}')
    
    if [ -n "$FRONTEND_URL" ]; then
        cd .deploy/backend
        railway variables set CORS_ORIGINS="$FRONTEND_URL"
        cd ../..
        print_success "CORS updated with frontend URL: $FRONTEND_URL"
    else
        print_warning "Could not determine frontend URL for CORS"
    fi
}

# Cleanup
cleanup() {
    print_status "Cleaning up temporary files..."
    rm -rf .deploy
    print_success "Cleanup complete"
}

# Show deployment info
show_info() {
    print_header "🎉 DEPLOYMENT COMPLETE"
    
    FRONTEND_URL=$(vercel ls | grep "https://" | head -1 | awk '{print $2}' 2>/dev/null || echo "Check Vercel dashboard")
    BACKEND_URL=$(cat .deploy/backend_url.txt 2>/dev/null || echo "Check Railway dashboard")
    
    echo -e "${GREEN}🌐 Frontend URL:${NC} $FRONTEND_URL"
    echo -e "${GREEN}🖥️ Backend URL:${NC} $BACKEND_URL"
    echo ""
    echo -e "${BLUE}📊 Vercel Dashboard:${NC} https://vercel.com/dashboard"
    echo -e "${BLUE}📊 Railway Dashboard:${NC} https://railway.app/dashboard"
    echo ""
    
    print_success "Split deployment complete! 🎉"
}

# Main execution
main() {
    print_header "🚀 VERCEL + RAILWAY DEPLOYMENT"
    
    check_dependencies
    deploy_backend
    deploy_frontend
    update_cors
    show_info
    cleanup
}

# Handle Ctrl+C
trap 'cleanup; echo -e "\n${YELLOW}Deployment cancelled${NC}"; exit 1' INT

# Run main function
main "$@"
