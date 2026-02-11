# Quick Reference - Development & Production Commands

## 🚀 LOCAL DEVELOPMENT SETUP

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)  
- MongoDB account (Atlas)
- Cloudinary account

### Installation

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Setup

#### Backend (.env)
```dotenv
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (.env)
```dotenv
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Start Development Servers

#### Method 1: Two Terminal Windows (Recommended)
```bash
# Terminal 1 - Backend
cd server
node server.js
# Output: 🚀 Server running on port 5000

# Terminal 2 - Frontend  
cd client
npm run dev
# Output: ➜ Local: http://localhost:3000/
```

#### Method 2: Using Concurrently (Optional)
Install concurrently:
```bash
npm install -D concurrently
```

Update root package.json:
```json
{
  "scripts": {
    "dev": "concurrently \"cd server && node server.js\" \"cd client && npm run dev\""
  }
}
```

Then run:
```bash
npm run dev
```

### Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: Use Postman or browser DevTools

---

## 🔧 COMMON COMMANDS

### Clear Port (Port Already in Use)
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux - Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Commands
```bash
# Test MongoDB connection
mongosh "your_connection_string"

# View collections
show collections

# Exit MongoDB
exit
```

### Frontend Build & Preview
```bash
# Development mode
cd client
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Backend Updates
```bash
# Install new package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update all packages
npm update
```

---

## 📦 PRODUCTION DEPLOYMENT

### Build Frontend
```bash
cd client
npm run build
# Creates 'dist' folder with optimized files
```

### Prepare Backend
```bash
cd server
# Ensure all dependencies are installed
npm install --production
```

### Deploy to Vercel (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# VITE_API_URL=https://your-api.com/api
# VITE_SOCKET_URL=https://your-api.com
```

### Deploy to Heroku (Backend)
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-frontend.com
heroku config:set MONGODB_URI=your_prod_mongodb
heroku config:set JWT_SECRET=your_prod_jwt_secret

# Deploy
git push heroku main
```

### Deploy to AWS (Backend)
```bash
# Use Elastic Beanstalk or EC2
# 1. Create EC2 instance
# 2. SSH into instance
# 3. Install Node.js
# 4. Clone repository
# 5. Configure environment variables
# 6. Start server with PM2 for persistence:

npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

### Deploy to Railway (Backend)
```bash
# Connect GitHub repository
# Railway will auto-detect Node.js
# Set environment variables in Railway dashboard
# Auto-deploys on git push
```

---

## 🧪 TESTING API ENDPOINTS

### Test Login Endpoint
```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response should include token
```

### Test Protected Route
```bash
# Using curl with token
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test CORS
```bash
# Open browser console on http://localhost:3000
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com', 
    password: 'password'
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

---

## 🐛 TROUBLESHOOTING

### Problem: CORS Error
**Solution**: 
1. Check CORS_ORIGIN in server/.env
2. Ensure it matches frontend URL exactly
3. Restart backend server

### Problem: 404 on API calls
**Solution**:
1. Check VITE_API_URL in client/.env
2. Restart frontend dev server
3. Check API routes are registered in backend

### Problem: Environment variables undefined
**Solution**:
1. Restart dev servers after adding .env
2. Use `import.meta.env.VITE_*` (not process.env)
3. Ensure .env file is in root directory

### Problem: Socket.IO connection fails
**Solution**:
1. Check VITE_SOCKET_URL in client/.env
2. Verify token is valid (not expired)
3. Check Socket.IO CORS in server.js

### Problem: Port already in use
**Solution**:
1. Use commands above to kill process on port
2. Or change PORT in server/.env
3. Or change port in vite.config.js

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Backend
- [ ] All environment variables set in production
- [ ] JWT_SECRET is strong (at least 32 characters)
- [ ] CORS_ORIGIN is set to production domain only
- [ ] MongoDB connection string verified
- [ ] Error handling implemented for all routes
- [ ] Rate limiting configured
- [ ] Logging implemented
- [ ] Tests passing (if applicable)

### Frontend
- [ ] Build process succeeds: `npm run build`
- [ ] Environment variables set for production
- [ ] All API calls use correct base URL
- [ ] No console errors in dev tools
- [ ] Responsive design tested
- [ ] Form validation working
- [ ] Error messages display properly

### Security
- [ ] HTTPS enabled on production
- [ ] .env files not committed to git
- [ ] Secrets rotated before deployment
- [ ] Input validation on both ends
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Authentication tokens not exposed

---

## 📚 USEFUL RESOURCES

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Socket.IO Docs](https://socket.io/docs/)
- [CORS Explanation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [JWT.io](https://jwt.io/)
- [Postman API Testing](https://www.postman.com/)

---

**Last Updated**: February 12, 2026  
**MERN Stack**: MongoDB, Express, React, Node.js  
**Frontend Port**: 3000 | **Backend Port**: 5000
