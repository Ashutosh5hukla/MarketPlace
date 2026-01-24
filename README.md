# Student Marketplace

Full-stack Student Marketplace built with Vite + React + Node.js + MongoDB

## 🚀 Features

- ✅ User authentication (JWT)
- ✅ Role-based access (buyer, seller, admin)
- ✅ Product CRUD operations
- ✅ Search & pagination
- ✅ Order management
- ✅ Responsive design

## 📦 Tech Stack

### Frontend
- Vite + React
- React Router
- Axios
- CSS3

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt

## 🏃 Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Configure Environment

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-marketplace
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:
```bash
mongod
```

Or use MongoDB Atlas (cloud).

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 📁 Project Structure

```
project/
├─ server/                 # Backend
│  ├─ src/
│  │  ├─ models/          # MongoDB schemas
│  │  ├─ controllers/     # Business logic
│  │  ├─ routes/          # API routes
│  │  ├─ middleware/      # Auth & error handling
│  │  ├─ config/          # Database config
│  │  └─ app.js           # Express app
│  ├─ server.js           # Entry point
│  └─ package.json
│
└─ client/                 # Frontend
   ├─ src/
   │  ├─ components/      # React components
   │  ├─ pages/           # Page components
   │  ├─ api.js           # API service
   │  ├─ App.jsx          # Main app
   │  └─ main.jsx         # Entry point
   └─ package.json
```

## 🔐 API Endpoints

### Auth
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product
- POST `/api/products` - Create product (Seller)
- PUT `/api/products/:id` - Update product
- DELETE `/api/products/:id` - Delete product

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders/my` - Get user orders
- GET `/api/orders/:id` - Get order details

## 🎯 Resume Bullet

> Built a full-stack marketplace using Vite, React, Node.js, Express, and MongoDB with JWT-based authentication and scalable REST APIs.

## 📝 Interview Topics Covered

- RESTful API design
- JWT authentication flow
- Role-based access control
- MongoDB schema design
- React Router navigation
- State management
- Error handling
- Middleware patterns
- Database indexing

## 🚀 Next Steps

- Add image upload functionality
- Implement shopping cart
- Add payment integration
- Deploy to production (Vercel + Railway/Render)
- Add product reviews
- Implement real-time chat
