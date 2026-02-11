# MERN Stack - Complete Troubleshooting Guide

## 🔍 Diagnostics & Solutions

### Issue 1: CORS Error - "Access-Control-Allow-Origin Header Missing"

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

**Root Causes:**
1. Wrong CORS_ORIGIN in server/.env
2. CORS middleware not applied before routes
3. OPTIONS preflight request not handled
4. Frontend URL doesn't match CORS_ORIGIN

**Solution:**
```bash
# Step 1: Check server/.env
# Should have: CORS_ORIGIN=http://localhost:3000

# Step 2: Check server/src/app.js
# Should have:
#  - const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
#  - app.use(cors(corsOptions));
#  - app.options('*', cors(corsOptions));

# Step 3: Restart servers
cd server && node server.js  # Terminal 1
cd client && npm run dev     # Terminal 2

# Step 4: Test in browser console
fetch('http://localhost:5000/', { credentials: 'include' })
  .then(r => r.json())
  .then(d => console.log(d))
```

---

### Issue 2: API Returns 404 - "/api/auth/login Not Found"

**Error Message:**
```
GET http://localhost:5000/api/auth/login 404 (Not Found)
```

**Root Causes:**
1. Wrong API_URL in client/.env
2. API_URL includes full path already
3. Axios request building wrong URL
4. Backend routes not registered
5. Typo in endpoint path

**Diagnosis:**
```javascript
// In browser console
console.log('API URL:', import.meta.env.VITE_API_URL)
// Should output: http://localhost:5000/api

// Check actual request URL
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password' })
})
```

**Solution:**
```javascript
// client/src/api.js - Correct format
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Usage
export const login = async (credentials) => {
  // Correct: /api/auth/login
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

// Verify backend routes in server/src/app.js
app.use("/api/auth", authRoutes);      // ✅ Correct
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
```

---

### Issue 3: Environment Variables Undefined

**Error Message:**
```
import.meta.env.VITE_API_URL is undefined
VITE environment variable not found
```

**Root Causes:**
1. .env file in wrong location
2. .env file not in root of project
3. Dev server not restarted after adding .env
4. Using process.env instead of import.meta.env
5. Variable name doesn't start with VITE_

**Solution:**

**File Structure (Correct):**
```
client/
├── .env .................. ✅ Correct location (root of client)
├── vite.config.js
├── src/
│   ├── api.js
│   └── ...
└── package.json
```

**File Structure (Wrong):**
```
client/
├── src/
│   ├── .env ............ ❌ Wrong! Must be in root
│   └── api.js
└── package.json
```

**Correct Usage in Code:**
```javascript
// ✅ Correct
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ❌ Wrong - Won't work
const API_URL = process.env.VITE_API_URL;

// ❌ Wrong - Variable must start with VITE_
const API_URL = import.meta.env.API_URL;
```

**Fix Steps:**
```bash
# 1. Ensure .env is in correct location
cat client/.env
# Should show:
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000

# 2. Restart dev server (Vite will reload .env)
cd client
npm run dev

# 3. Verify in browser console
console.log(import.meta.env.VITE_API_URL)
# Should output: http://localhost:5000/api
```

---

### Issue 4: Port Already in Use (EADDRINUSE)

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Root Causes:**
1. Another process using the same port
2. Server didn't fully close previous run
3. Multiple instances started

**Solution:**

**Windows:**
```powershell
# Find process on port 5000
netstat -ano | findstr :5000
# Output: TCP  0.0.0.0:5000  0.0.0.0:0  LISTENING  12345

# Kill process by PID
taskkill /PID 12345 /F

# Repeat for port 3000
netstat -ano | findstr :3000
taskkill /PID 12345 /F
```

**macOS/Linux:**
```bash
# Find process on port 5000
lsof -ti:5000 | xargs kill -9

# Find process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Alternative: Change Port**

If you can't kill the process:
```bash
# Backend - Change in server/.env
PORT=5001  # Use different port

# Frontend - Change in vite.config.js
export default defineConfig({
  server: {
    port: 3001,  // Use different port
  }
})

# Also update VITE_API_URL
VITE_API_URL=http://localhost:5001/api
```

---

### Issue 5: Socket.IO Connection Fails

**Error Message:**
```
WebSocket connection to 'ws://localhost:5000/socket.io/?...' failed
Socket.IO connection refused
```

**Root Causes:**
1. Invalid/expired JWT token
2. Socket.IO CORS not configured
3. Wrong Socket URL
4. Backend not listening
5. Firewall blocking WebSocket

**Diagnosis:**
```javascript
// In browser console
const token = localStorage.getItem('token');
console.log('Token:', token);
console.log('Token valid:', token && token.length > 0);

// Check Socket URL
console.log('Socket URL:', import.meta.env.VITE_SOCKET_URL);
```

**Solution:**

**Check Token:**
```javascript
// Verify token is stored
const token = localStorage.getItem('token');
if (!token) {
  console.error('❌ No token found - Login required');
} else {
  console.log('✅ Token found');
}
```

**Check CORS in server/server.js:**
```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST']
  }
});
```

**Check Environment Variables:**
```javascript
// client/.env
VITE_SOCKET_URL=http://localhost:5000

// client/src/pages/Messages.jsx
const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const socket = io(socketUrl, {
  auth: { token: localStorage.getItem('token') }
});
```

---

### Issue 6: API Calls Always Fail

**Error Messages:**
```
TypeError: Cannot read property 'data' of undefined
axios error: ERR_FAILED
Failed to load resource: net::ERR_FAILED
```

**Checklist:**
- [ ] Backend server running on port 5000?
- [ ] Frontend server running on port 3000?
- [ ] CORS_ORIGIN matches frontend URL?
- [ ] VITE_API_URL correct in .env?
- [ ] Authorization header included?
- [ ] Content-Type header set?

**Test Template:**
```javascript
// In browser console
async function testAPI() {
  const API_URL = 'http://localhost:5000/api';
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password'
      })
    });
    
    const data = await response.json();
    console.log('✅ Success:', data);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
```

---

### Issue 7: Frontend Blank/White Screen

**Root Causes:**
1. React component error
2. Missing dependencies
3. Build issue
4. Import error

**Debug Steps:**
```bash
# Step 1: Check browser console for errors
# Press F12 → Console tab → Look for red errors

# Step 2: Check network tab for failed requests
# F12 → Network → Check for 404s on API calls

# Step 3: Check if frontend is even loading
# Look for React DevTools icon in browser

# Step 4: Rebuild frontend
cd client
npm run build

# Step 5: Preview build locally
npm run preview
```

---

### Issue 8: Authentication Not Working

**Common Issues:**
1. Token not saved to localStorage
2. Token expired
3. Backend not validating token
4. Authorization header not included

**Debug Steps:**
```javascript
// Check token storage
console.log('Stored token:', localStorage.getItem('token'));
console.log('Stored user:', localStorage.getItem('user'));

// Check if login response includes token
// (Look in Network tab → login request → Response)

// Manually decode JWT to check expiration
// Use: https://jwt.io/ (paste token in debugger)
```

**Fix Login Function:**
```javascript
// client/src/api.js
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    
    if (response.data.token) {
      // Save token
      localStorage.setItem('token', response.data.token);
      // Save user data
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log('✅ Login successful');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data);
    throw error;
  }
};
```

---

### Issue 9: Database Connection Failed

**Error Message:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
MongooseError: Could not connect to MongoDB
```

**Root Causes:**
1. MongoDB Atlas not accessible
2. Wrong connection string
3. IP whitelist not configured
4. Network issue

**Solution:**
```bash
# Step 1: Test connection string manually
mongosh "your_connection_string"

# Step 2: Verify in server/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Step 3: Check MongoDB Atlas
# - Login to mongodb.com
# - Verify cluster is running
# - Add current IP to whitelist
# - Create user with correct password (no special chars unless escaped)

# Step 4: Restart server with debugging
NODE_DEBUG=mongoose node server.js
```

---

### Issue 10: Cloudinary Upload Fails

**Error Message:**
```
Error: Upload to Cloudinary failed
CloudinaryError: Invalid credentials
```

**Root Causes:**
1. Wrong Cloudinary credentials
2. API key/secret not URL-encoded
3. Account doesn't have upload preset

**Solution:**
```bash
# Step 1: Verify credentials in server/.env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=your_secret_key

# Step 2: Check credentials at cloudinary.com
# - Dashboard → Account Details → API Keys
# - Copy exact values

# Step 3: If special characters, URL encode them:
# @ becomes %40
# : becomes %3A

# Step 4: Restart server
cd server
node server.js
```

---

## 📋 Quick Diagnostics Checklist

```bash
# Before debugging, run these checks:

# ✅ Check ports are available
netstat -ano | findstr ":3000"
netstat -ano | findstr ":5000"

# ✅ Check backend is running
curl http://localhost:5000/

# ✅ Check environment files exist
ls -la server/.env
ls -la client/.env

# ✅ Check dependencies installed
cd server && npm list express
cd ../client && npm list react

# ✅ Check git status (ensure no secrets committed)
git status
git log --all --full-history -S CLOUDINARY_API_KEY
```

---

## 🆘 When All Else Fails

```bash
# 1. Clear everything and start fresh
cd server && rm -rf node_modules package-lock.json && npm install
cd ../client && rm -rf node_modules package-lock.json && npm install

# 2. Kill all Node processes
pkill -f node  # macOS/Linux
Get-Process node | Stop-Process -Force  # Windows PowerShell

# 3. Clear browser cache
# Ctrl+Shift+Delete in most browsers

# 4. Restart from scratch
cd server && node server.js
cd client && npm run dev

# 5. Check browser console for actual error messages
# F12 → Console → Look for specific error
```

---

## 📞 Getting Help

When asking for help, include:
1. **Exact error message** - Copy from console
2. **What you were doing** - Step by step
3. **Output of diagnostics** - Port checks, env vars
4. **Browser console errors** - Screenshot or text
5. **Terminal output** - Full server startup output
6. **File contents** - .env file (without secrets)

**Example Good Bug Report:**
```
Error: CORS blocked localhost:3000 → localhost:5000
Steps to reproduce:
1. Started backend on port 5000
2. Started frontend on port 3000
3. Tried to login
4. Got CORS error

Diagnostic info:
- Server/.env has CORS_ORIGIN=http://localhost:3000
- Backend app.js has cors configured
- Browser error shows no Access-Control-Allow-Origin header

Screenshot: [image1.png]
Terminal output: [output.log]
```

---

## ✅ Success Verification

Your setup is working when you see:

**Backend Console:**
```
✅ Cloudinary configured
✅ MongoDB Connected: [connection string]
✅ Cloudinary Connected Successfully
🚀 Server running on port 5000
📍 Environment: development
```

**Frontend Console:**
```
➜ Local: http://localhost:3000/
```

**Browser:**
- Page loads without errors
- No Network 404s
- No Console errors
- Login/Register works
- API calls succeed

**DevTools Network Tab:**
```
✅ POST /api/auth/login → 200 OK
✅ Headers show: Access-Control-Allow-Origin: http://localhost:3000
✅ Response contains: { token: "...", user: {...} }
```

---

**Last Updated**: February 12, 2026  
**Status**: Comprehensive troubleshooting guide ready
