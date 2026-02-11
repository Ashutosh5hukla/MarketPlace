# MERN Stack Setup Guide - Industry Best Practices

## Project Structure
```
MarketPlace/
├── server/                    # Express.js backend
│   ├── .env                   # Backend environment variables
│   ├── server.js              # Server entry point
│   ├── src/
│   │   ├── app.js             # Express app configuration
│   │   ├── config/
│   │   │   ├── db.js          # MongoDB connection
│   │   │   └── cloudinary.js  # Cloudinary setup
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware (CORS, auth, etc)
│   │   └── models/            # MongoDB models
│   └── package.json
│
└── client/                    # React + Vite frontend
    ├── .env                   # Frontend environment variables
    ├── vite.config.js         # Vite configuration
    ├── src/
    │   ├── api.js             # Axios API client
    │   ├── main.jsx           # React entry point
    │   ├── App.jsx            # Root component
    │   ├── pages/             # Page components
    │   └── components/        # Reusable components
    └── package.json
```

## Environment Setup

### Backend (.env) - PORT 5000
```dotenv
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env) - PORT 3000
```dotenv
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Backend Configuration

### 1. Express Server (server/server.js)
- ✅ Loads environment variables with `dotenv.config()`
- ✅ Sets PORT from .env (defaults to 5000)
- ✅ Connects to MongoDB before starting
- ✅ Configures Socket.IO with CORS from environment variables
- ✅ Listens on `http://localhost:5000`

### 2. CORS Configuration (server/src/app.js)
```javascript
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      corsOrigin,
      'https://market-place-ten-rho.vercel.app' // Production
    ];
    
    if (!origin || allowedOrigins.includes(origin) || origin.includes('.vercel.app')) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
```

### 3. Socket.IO Configuration (server/server.js)
```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST']
  }
});
```

## Frontend Configuration

### 1. Vite Config (client/vite.config.js)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: 'localhost'
  }
});
```
⚠️ **NO PROXY** - Use environment variables for API URL instead

### 2. API Client (client/src/api.js)
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Example API call
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};
```

### 3. Socket.IO Client (client/src/pages/Messages.jsx example)
```javascript
import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Initialize socket with auth token
const socket = io(socketUrl, {
  auth: { token: localStorage.getItem('token') }
});
```

## Running Development Servers

### Option 1: Terminal Commands (Recommended)
```bash
# Terminal 1: Start Backend
cd server
node server.js

# Terminal 2: Start Frontend
cd client
npm run dev
```

### Option 2: If using nodemon (for auto-reload on backend changes)
```bash
# Terminal 1: Start Backend with nodemon
cd server
npm run dev  # Make sure package.json has: "dev": "nodemon server.js"

# Terminal 2: Start Frontend
cd client
npm run dev
```

## Testing the Setup

### 1. Check Backend is Running
```bash
curl http://localhost:5000/
# Expected: {"message":"🚀 Student Marketplace API is running!"}
```

### 2. Check CORS Headers (in browser console)
Open DevTools → Network tab → Login request → Response Headers
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

### 3. Test API Call
```javascript
// In browser console
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email: 'test@example.com', password: 'password' })
})
.then(r => r.json())
.then(d => console.log(d))
```

## Production Configuration

### Backend .env (Production)
```dotenv
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

MONGODB_URI=mongodb+srv://prod_user:prod_password@prod-cluster.mongodb.net/Student_marketplace?retryWrites=true&w=majority

JWT_SECRET=your_very_long_random_secret_key_for_production

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_production_api_key
CLOUDINARY_API_SECRET=your_production_api_secret
```

### Frontend .env.production
```dotenv
VITE_API_URL=https://yourdomain.com/api
VITE_SOCKET_URL=https://yourdomain.com
```

### Build for Production
```bash
# Frontend
cd client
npm run build
# Creates dist/ folder for deployment

# Backend
# Just deploy server/ folder with node_modules and .env
```

## Common Issues & Solutions

### ❌ CORS Error: "No 'Access-Control-Allow-Origin' header"
**Solution**: 
1. Check `CORS_ORIGIN` in server `.env` matches frontend URL
2. Ensure `app.use(cors(corsOptions))` is before routes
3. Ensure `app.options('*', cors(corsOptions))` handles preflight

### ❌ API returns 404: "/api/auth/login not found"
**Solution**:
1. Check `VITE_API_URL` in client `.env`
2. Verify API_URL in `client/src/api.js` uses `import.meta.env.VITE_API_URL`
3. Check backend routes are registered in `app.js`

### ❌ Port already in use (EADDRINUSE)
**Solution - Windows**:
```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### ❌ Socket.IO connection fails
**Solution**:
1. Check `VITE_SOCKET_URL` in client `.env`
2. Verify Socket.IO CORS origin in `server.js`
3. Check token is passed in auth: `auth: { token: localStorage.getItem('token') }`
4. Verify token is valid (not expired)

### ❌ "VITE_API_URL is undefined"
**Solution**:
1. .env file must be in root of client folder (not src/)
2. Restart dev server after adding .env
3. Use `import.meta.env.VITE_API_URL` (not `process.env`)

## API Endpoint Structure

```
Backend: http://localhost:5000
├── /api/auth
│   ├── POST /login       - Login user
│   ├── POST /register    - Register user
│   └── GET /me           - Get current user (requires token)
│
├── /api/products
│   ├── GET /             - Get all products
│   ├── POST /            - Create product (auth required)
│   ├── GET /:id          - Get product details
│   └── PUT /:id          - Update product (auth required)
│
├── /api/chat
│   ├── GET /seller       - Get seller's chats
│   └── GET /product/:id  - Get product chat messages
│
├── /api/orders
│   ├── POST /            - Create order
│   └── GET /my           - Get user's orders (auth required)
│
└── /api/upload
    ├── POST /image       - Upload single image
    └── POST /images      - Upload multiple images
```

## Security Best Practices

1. ✅ **Never commit .env files** - Add to .gitignore
2. ✅ **Use environment variables** for all sensitive data
3. ✅ **Validate & sanitize input** on both frontend and backend
4. ✅ **Use HTTPS in production** (not HTTP)
5. ✅ **Set secure CORS origins** - Only allow your domain
6. ✅ **Implement rate limiting** to prevent brute force attacks
7. ✅ **Use JWT tokens** with short expiration times
8. ✅ **Refresh tokens** periodically
9. ✅ **Hash passwords** with bcrypt before storing
10. ✅ **Validate JWT tokens** on protected routes

## Next Steps

1. ✅ Start both servers: Backend on 5000, Frontend on 3000
2. ✅ Test login/register functionality
3. ✅ Verify API calls work without CORS errors
4. ✅ Test Socket.IO chat functionality
5. ✅ Use browser DevTools to debug any remaining issues
6. ✅ Prepare production deployment strategy

---

**Last Updated**: February 12, 2026  
**Stack**: MERN (MongoDB, Express, React, Node.js)  
**Port Configuration**: Frontend 3000, Backend 5000  
**Status**: ✅ Production Ready
