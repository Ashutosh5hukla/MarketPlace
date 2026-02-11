# Deployment Fix for 404 Error

## Problem
Getting 404 error on production: `marketplace-pf98.onrender.com/auth/login`

## Root Cause
The frontend environment variable `VITE_API_URL` is missing the `/api` path suffix.

## Solution

### If Deployed on Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Find or add `VITE_API_URL`
4. Set the value to: `https://marketplace-pf98.onrender.com/api`
   - ⚠️ **Important**: Must include `/api` at the end!
5. Save and **redeploy** your application

### If Deployed on Other Platform:

Set the environment variable:
```bash
VITE_API_URL=https://marketplace-pf98.onrender.com/api
```

### For Local Development:

Create a `.env` file in the `client` folder:
```bash
cd client
echo VITE_API_URL=http://localhost:5000/api > .env
```

## Verification

After redeployment, your API calls should work:
- ✅ Login: `https://marketplace-pf98.onrender.com/api/auth/login`
- ✅ Products: `https://marketplace-pf98.onrender.com/api/products`
- ✅ Orders: `https://marketplace-pf98.onrender.com/api/orders`

## Quick Check

Open browser console and run:
```javascript
console.log(import.meta.env.VITE_API_URL)
```
Should output: `https://marketplace-pf98.onrender.com/api`
