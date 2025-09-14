# 🚀 Render Deployment Guide

## Quick Deploy Steps

### 1. Push to GitHub (if not already done)
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Deploy to Render
1. **Go to [render.com](https://render.com)**
2. **Sign up/Login** (use GitHub for easy connection)
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Render will auto-detect `render.yaml`** ✅

### 3. Configuration (Auto-filled from render.yaml)
- **Name**: `sharewealth-hub`
- **Runtime**: `Node`
- **Build Command**: `npm install && pip3 install -r requirements.txt && npm run build`
- **Start Command**: `./start-deploy.sh`
- **Environment Variables**: (Auto-configured)
  - `NODE_ENV=production`
  - `PYTHONPATH=/app`
  - `DATABASE_URL=sqlite:///./finance.db`
  - `CORS_ORIGINS=*`

### 4. Deploy!
- **Click "Create Web Service"**
- **Wait 5-10 minutes** for deployment
- **Your app will be live!** 🎉

## 📊 What Happens During Deployment

1. **Build Phase**: 
   - Install Node.js dependencies
   - Install Python dependencies
   - Build Next.js frontend

2. **Start Phase**:
   - Initialize SQLite database
   - Start FastAPI backend (port 8000)
   - Start Next.js frontend (port 3000 or Render's PORT)

## 🔗 After Deployment

Your app will be available at:
- **Frontend & Backend**: `https://your-app-name.onrender.com`
- **API Documentation**: `https://your-app-name.onrender.com/docs`
- **Database Test**: `https://your-app-name.onrender.com/test-database`

## 🎯 Key Features Available

✅ **Full-Stack App** - Frontend + Backend  
✅ **File Upload** - PDF statement processing  
✅ **Dashboard** - Financial data visualization  
✅ **Databricks Integration** - Advanced analytics  
✅ **SQLite Database** - Persistent data storage  
✅ **API Documentation** - Interactive Swagger UI  

## 🛠️ Troubleshooting

### If Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in `requirements.txt` and `package.json`

### If App Doesn't Start
- Check application logs in Render dashboard
- Verify `start-deploy.sh` has execute permissions

### Database Issues
- SQLite database is created automatically
- Check logs for database initialization errors

## 🔧 Environment Variables (Optional)

Add these in Render dashboard if needed:
- `DATABRICKS_HOST` - Your Databricks workspace URL
- `DATABRICKS_TOKEN` - Your Databricks access token
- `DATABRICKS_HTTP_PATH` - Your warehouse HTTP path

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Build Logs**: Available in Render dashboard
- **App Logs**: Real-time monitoring in dashboard

---

🎉 **Ready to deploy!** Follow the steps above and your app will be live in minutes!
