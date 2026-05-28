# Deployment Guide - Catalyst to Render

This guide will help you deploy the Catalyst application to Render.

## 🚀 Step-by-Step Deployment

### Step 1: Prepare MongoDB Database

Catalyst requires MongoDB. Use **MongoDB Atlas** (free tier available):

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project
4. Create a free cluster
5. Add a database user and password
6. Get your connection string (it looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/catalyst?retryWrites=true&w=majority
   ```
7. Keep this connection string - you'll need it in Step 3

### Step 2: Deploy on Render

1. Go to [Render.com](https://render.com/)
2. Sign up or log in with GitHub
3. Click **New +** → **Web Service**
4. Select **Catalyst** repository
5. Configure:
   - **Name**: `catalyst-api`
   - **Environment**: Node
   - **Region**: Closest to you
   - **Branch**: `develop`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables on Render

In the Render dashboard, scroll to **Environment** section and add:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/catalyst?retryWrites=true&w=majority
JWT_SECRET=generate_a_strong_random_secret_key_here
PORT=5000
```

**Generate a strong JWT_SECRET:**
```powershell
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use an online generator and create a random 32+ character string.

### Step 4: Configure MongoDB Atlas Whitelist

Since Render uses dynamic IPs:

1. Go to MongoDB Atlas Dashboard
2. Go to **Network Access**
3. Click **Add IP Address**
4. Enter `0.0.0.0/0` (allows all IPs - only do this for development)
   - For production, configure Render's outbound IP if available
5. Click **Confirm**

### Step 5: Deploy

1. Click **Create Web Service** on Render
2. Wait for build to complete (usually 2-5 minutes)
3. Once deployed, you'll see a live URL like:
   ```
   https://catalyst-api.onrender.com
   ```

### Step 6: Update Frontend API URL

The frontend needs to know your backend URL. You have two options:

**Option A: Environment Variable (Recommended)**
1. Add to `frontend/.env`:
   ```
   VITE_API_URL=https://catalyst-api.onrender.com
   ```
2. Update `frontend/src/` files to use `import.meta.env.VITE_API_URL`

**Option B: Production Server**
- Render automatically serves your `frontend/dist` from the backend
- Frontend will automatically use the correct API URL

### Step 7: Test Your Deployment

Visit your Render URL:
```
https://catalyst-api.onrender.com
```

You should see:
```json
{
  "status": "UP",
  "message": "Catalyst API server running successfully"
}
```

## 🔄 Auto-Deployment

Render is configured to auto-deploy whenever you push to the `develop` branch:

```bash
git push origin develop
# Render automatically detects changes and redeploys
```

## 🛠️ Troubleshooting

### Build Failed
- Check the **Logs** tab in Render dashboard
- Ensure all environment variables are set correctly
- Verify `npm run build` works locally: `npm run build`

### MongoDB Connection Error
- Test connection string locally in `.env`
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check that database username/password are correct

### Frontend not loading
- Check that `render.yaml` is properly configured
- Ensure `frontend` build files exist in `frontend/dist`
- Verify the build command produces the dist folder

### Slow startup
- Free tier on Render may take longer to boot
- First request can be slow (cold start)
- Consider upgrading for production use

## 📊 Monitoring

On Render dashboard you can:
- View **Logs** in real-time
- Check **Metrics** (CPU, memory)
- Restart the service
- View deployment history

## 💾 Backup MongoDB Data

Regularly backup MongoDB Atlas:

1. Go to MongoDB Atlas Dashboard
2. Click **Backup** in the left menu
3. Create manual snapshots before major updates
4. Download/restore as needed

## 🔐 Security Notes for Production

Before going live, consider:

1. **Change JWT_SECRET** to a complex random string
2. **Restrict MongoDB IP** instead of `0.0.0.0/0`
3. **Add HTTPS** (Render handles this automatically)
4. **Setup environment parity** between dev and prod
5. **Monitor logs** for errors and attacks
6. **Setup email notifications** for deployment alerts

## ✨ Deployment Complete!

Your Catalyst app is now live! Share the URL:
```
https://catalyst-api.onrender.com
```

For troubleshooting or questions, check Render's documentation or review the logs in the dashboard.

---

**Happy deploying! 🚀**
