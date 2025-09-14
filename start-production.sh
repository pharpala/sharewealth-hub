#!/bin/bash

# 🚀 Production Startup Script
# Optimized for production deployment

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

# Set production environment
export NODE_ENV=production
export PYTHONPATH=/app

# Initialize database
print_status "Initializing database..."
python3 api/sqlite_db.py
print_success "Database initialized"

# Build frontend if not already built
if [ ! -d ".next" ]; then
    print_status "Building frontend..."
    npm run build
    print_success "Frontend built"
fi

# Start backend server
print_status "Starting backend server..."
python3 api/main.py &
BACKEND_PID=$!

# Wait for backend to be ready
print_status "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://127.0.0.1:8000/test-database > /dev/null 2>&1; then
        print_success "Backend server is ready"
        break
    fi
    sleep 1
done

# Start frontend server
print_status "Starting frontend server..."
npm start &
FRONTEND_PID=$!

# Wait for frontend to be ready
print_status "Waiting for frontend to be ready..."
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend server is ready"
        break
    fi
    sleep 1
done

print_success "🎉 Production servers are running!"
echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}Backend:${NC} http://localhost:8000"
echo -e "${GREEN}API Docs:${NC} http://localhost:8000/docs"

# Keep both processes running
wait $BACKEND_PID
wait $FRONTEND_PID
