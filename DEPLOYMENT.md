# 🚀 Deployment Guide

This guide covers multiple deployment options for your full-stack financial application.

## 📋 Prerequisites

- Node.js 18+
- Python 3.11+
- Git repository

## 🎯 Recommended: Railway (One-Click Deploy)

Railway is perfect for your full-stack app because it handles both frontend and backend seamlessly.

### Quick Deploy
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy with one command
npm run deploy:railway
```

### Manual Railway Setup
```bash
# Login to Railway
railway login

# Initialize project
railway init

# Set environment variables
railway variables set NODE_ENV=production
railway variables set PYTHONPATH=/app
railway variables set DATABASE_URL="sqlite:///./finance.db"

# Deploy
railway up
```

## 🌐 Alternative: Vercel + Railway Split

Deploy frontend to Vercel, backend to Railway for optimal performance.

```bash
# Install CLIs
npm install -g vercel @railway/cli

# Deploy both with one command
npm run deploy:vercel
```

## 🐳 Docker Deployment

Deploy anywhere with Docker containers.

### Local Docker
```bash
# Build and run
npm run deploy:docker

# Or manually
docker build -t my-nextjs-app .
docker run -p 3000:3000 -p 8000:8000 my-nextjs-app
```

### Docker Compose (Recommended)
```bash
# Create docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - PYTHONPATH=/app
      - DATABASE_URL=sqlite:///./finance.db
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs

# Deploy
docker-compose up -d
```

## ☁️ Cloud Provider Options

### AWS EC2/ECS
1. Build Docker image
2. Push to ECR
3. Deploy with ECS or EC2

### Google Cloud Run
```bash
# Build and deploy
gcloud run deploy --source .
```

### Azure Container Instances
```bash
# Build and deploy
az container create --resource-group myRG --name myapp --image myapp:latest
```

## 🔧 Environment Variables

Copy `env.example` to `.env` and configure:

### Required
- `NODE_ENV=production`
- `DATABASE_URL=sqlite:///./finance.db`

### Optional (Databricks)
- `DATABRICKS_HOST`
- `DATABRICKS_TOKEN`
- `DATABRICKS_HTTP_PATH`
- `DATABRICKS_SCHEMA`

### Frontend URLs
- `NEXT_PUBLIC_API_URL` - Your backend URL
- `NEXT_PUBLIC_APP_URL` - Your frontend URL

## 📊 Database Strategy

### Development
- SQLite (included) - Perfect for demos and development

### Production Options
1. **SQLite** - Simple, included, great for small-medium apps
2. **PostgreSQL** - Scalable, Railway/Vercel provide managed options
3. **Databricks** - Advanced analytics (optional)

## 🚀 Deployment Commands

| Platform | Command |
|----------|---------|
| Railway | `npm run deploy:railway` |
| Vercel Split | `npm run deploy:vercel` |
| Docker Local | `npm run deploy:docker` |
| Production Server | `./start-production.sh` |

## 🔍 Monitoring & Logs

### Railway
```bash
railway logs --follow
```

### Vercel
```bash
vercel logs
```

### Docker
```bash
docker logs -f container_name
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Backend: Port 8000
   - Frontend: Port 3000
   - Solution: Check if ports are available

2. **Database Permissions**
   - Ensure SQLite file is writable
   - Check file permissions in production

3. **Environment Variables**
   - Verify all required vars are set
   - Check CORS_ORIGINS includes your domain

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify Python dependencies install correctly

### Health Checks
- Backend: `http://your-domain:8000/test-database`
- Frontend: `http://your-domain:3000`
- API Docs: `http://your-domain:8000/docs`

## 🎯 Performance Tips

1. **Enable Gzip**: Most platforms do this automatically
2. **Use CDN**: Vercel includes this, Railway available
3. **Database Optimization**: Consider connection pooling for high traffic
4. **Caching**: Implement Redis for session storage if needed

## 🔒 Security Checklist

- [ ] Environment variables properly set
- [ ] CORS origins configured correctly
- [ ] Database files have proper permissions
- [ ] API endpoints secured where needed
- [ ] HTTPS enabled (automatic on most platforms)

## 📞 Support

- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Docker: https://docs.docker.com

---

🎉 **Ready to deploy!** Choose your preferred method and launch your financial application to the world!
