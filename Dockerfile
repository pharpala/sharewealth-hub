# Simplified Dockerfile for Railway
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

WORKDIR /app

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy Python requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application code
COPY . .

# Build frontend
RUN npm run build

# Create necessary directories
RUN mkdir -p /app/data /app/logs

# Set environment variables
ENV PYTHONPATH=/app
ENV NODE_ENV=production
ENV PORT=3000

# Expose port (Railway uses PORT env var)
EXPOSE $PORT

# Create startup script
RUN echo '#!/bin/bash\n\
set -e\n\
echo "🚀 Starting Railway deployment..."\n\
\n\
# Initialize database\n\
python3 api/sqlite_db.py\n\
\n\
# Start backend in background\n\
python3 api/main.py &\n\
\n\
# Start frontend on Railway port\n\
npm start -- -p ${PORT:-3000}\n\
' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
