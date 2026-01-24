# Student Marketplace - Backend

Full-stack Student Marketplace with Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-marketplace
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products (with pagination & search)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/seller/:sellerId` - Get products by seller
- `POST /api/products` - Create product (Seller/Admin only)
- `PUT /api/products/:id` - Update product (Owner/Admin only)
- `DELETE /api/products/:id` - Delete product (Owner/Admin only)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/my` - Get user's orders (Protected)
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## 🔐 Authentication Flow

1. User registers → Password hashed with bcrypt
2. User logs in → JWT token issued
3. Token sent in `Authorization: Bearer <token>` header
4. Middleware verifies token
5. Protected routes accessible

## 📦 Tech Stack

- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🎯 Features

- ✅ User authentication with JWT
- ✅ Role-based access control (buyer, seller, admin)
- ✅ Product CRUD operations
- ✅ Search & filter products
- ✅ Pagination
- ✅ Order management
- ✅ MongoDB indexes for performance
- ✅ Error handling middleware
- ✅ Input validation

## 📝 Project Structure

```
server/
├─ src/
│  ├─ models/         # MongoDB schemas
│  ├─ controllers/    # Business logic
│  ├─ routes/         # API routes
│  ├─ middleware/     # Auth & error handling
│  ├─ config/         # Database config
│  └─ app.js          # Express app setup
├─ server.js          # Entry point
└─ package.json
```

## 🧪 Testing API

Use Postman or Thunder Client:

1. **Register**: POST `http://localhost:5000/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "seller"
}
```

2. **Login**: POST `http://localhost:5000/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

3. **Create Product**: POST `http://localhost:5000/api/products`
(Add `Authorization: Bearer <token>` header)
```json
{
  "title": "Calculus Textbook",
  "description": "Like new condition",
  "price": 45.99,
  "category": "Books",
  "images": ["image1.jpg"]
}
```

## 🚀 Performance Tips

- Indexed fields: `email`, `price`, `category`
- Use `populate()` only when needed
- Pagination with `limit` + `skip`
- Avoid deep nesting in queries
