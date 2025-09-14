#!/bin/bash

# 🚀 Railway Deployment Script
# Deploys your full-stack app to Railway with one command

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Check if Railway CLI is installed
check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI is not installed"
        echo "Install it with: npm install -g @railway/cli"
        echo "Or visit: https://docs.railway.app/develop/cli"
        exit 1
    fi
    print_success "Railway CLI found: $(railway --version)"
}

# Login to Railway
railway_login() {
    print_status "Checking Railway authentication..."
    if ! railway whoami &> /dev/null; then
        print_warning "Not logged in to Railway"
        print_status "Opening Railway login..."
        railway login
    else
        print_success "Already logged in to Railway"
    fi
}

# Create or link Railway project
setup_project() {
    print_header "🚀 SETTING UP RAILWAY PROJECT"
    
    if [ ! -f ".railway/project.json" ]; then
        print_status "Creating new Railway project..."
        railway init
        print_success "Railway project created"
    else
        print_success "Railway project already exists"
    fi
}

# Set environment variables
set_env_vars() {
    print_header "🔧 SETTING ENVIRONMENT VARIABLES"
    
    print_status "Setting production environment variables..."
    
    # Core app variables
    railway variables set NODE_ENV=production
    railway variables set PYTHONPATH=/app
    
    # Database
    railway variables set DATABASE_URL="sqlite:///./finance.db"
    
    # CORS (will be updated with actual domain after deployment)
    railway variables set CORS_ORIGINS="*"
    
    # Optional Databricks (only set if you have these)
    if [ -n "$DATABRICKS_TOKEN" ]; then
        railway variables set DATABRICKS_HOST="$DATABRICKS_HOST"
        railway variables set DATABRICKS_HTTP_PATH="$DATABRICKS_HTTP_PATH" 
        railway variables set DATABRICKS_TOKEN="$DATABRICKS_TOKEN"
        railway variables set DATABRICKS_SCHEMA="finance"
        print_success "Databricks variables set"
    else
        print_warning "Databricks variables not set (optional)"
    fi
    
    print_success "Environment variables configured"
}

# Deploy to Railway
deploy() {
    print_header "🚀 DEPLOYING TO RAILWAY"
    
    print_status "Starting deployment..."
    railway up --detach
    
    print_status "Waiting for deployment to complete..."
    sleep 10
    
    # Get the deployment URL
    RAILWAY_URL=$(railway domain 2>/dev/null || echo "")
    
    if [ -n "$RAILWAY_URL" ]; then
        print_success "Deployment successful!"
        echo -e "${GREEN}🌐 Your app is live at: https://$RAILWAY_URL${NC}"
        
        # Update CORS with actual domain
        railway variables set CORS_ORIGINS="https://$RAILWAY_URL"
        railway variables set NEXT_PUBLIC_API_URL="https://$RAILWAY_URL"
        railway variables set NEXT_PUBLIC_APP_URL="https://$RAILWAY_URL"
        
        print_success "Environment variables updated with production URLs"
    else
        print_warning "Deployment completed, but couldn't retrieve URL"
        print_status "Check Railway dashboard: https://railway.app/dashboard"
    fi
}

# Show post-deployment info
show_info() {
    print_header "🎉 DEPLOYMENT COMPLETE"
    
    echo -e "${BLUE}📊 Railway Dashboard:${NC} https://railway.app/dashboard"
    echo -e "${BLUE}📖 Deployment Logs:${NC} railway logs"
    echo -e "${BLUE}🔧 Manage Variables:${NC} railway variables"
    echo -e "${BLUE}🚀 Redeploy:${NC} railway up"
    echo ""
    
    echo -e "${YELLOW}💡 Next Steps:${NC}"
    echo "1. Test your deployed application"
    echo "2. Set up custom domain (optional): railway domain"
    echo "3. Configure Databricks if needed"
    echo "4. Monitor logs: railway logs --follow"
    echo ""
    
    print_success "Your app is ready for production! 🎉"
}

# Main execution
main() {
    print_header "🚀 RAILWAY DEPLOYMENT SETUP"
    
    check_railway_cli
    railway_login
    setup_project
    set_env_vars
    deploy
    show_info
}

# Handle Ctrl+C
trap 'echo -e "\n${YELLOW}Deployment cancelled${NC}"; exit 1' INT

# Run main function
main "$@"
