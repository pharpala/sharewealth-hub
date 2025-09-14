#!/bin/bash

# 🚀 Production Deployment Startup Script
# Optimized for cloud deployment platforms

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Set production environment
export NODE_ENV=production
export PYTHONPATH=${PYTHONPATH:-/app}

print_status "🚀 Starting production deployment..."

# Initialize database
print_status "Initializing database..."
python3 api/sqlite_db.py
print_success "Database initialized"

# Start backend server in background
print_status "Starting backend server..."
python3 api/main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
print_status "Starting frontend server..."
if [ -n "$PORT" ]; then
    # Use PORT environment variable (for platforms like Render, Railway)
    npm start -- -p $PORT
else
    # Default port
    npm start
fi
