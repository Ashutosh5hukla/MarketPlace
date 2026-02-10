
name: MarketPlace
description: A comprehensive full-stack e-commerce marketplace built with the MERN stack (MongoDB, Express, React, Node.js). This platform supports both product sales and rentals, featuring role-based access control (RBAC), integrated payment processing with Razorpay, and cloud-based image management with Cloudinary.
---

# MarketPlace - Full-Stack E-Commerce Platform

## Description

A comprehensive full-stack e-commerce marketplace built with the MERN stack (MongoDB, Express, React, Node.js). This platform supports both product sales and rentals, featuring role-based access control (RBAC), integrated payment processing with Razorpay, and cloud-based image management with Cloudinary.

## Features

- **Multi-vendor Marketplace**: Support for multiple sellers with dedicated dashboards
- **Product Management**: Create, update, and manage products with image uploads
- **Dual Transaction Modes**: Both purchase and rental options for products
- **Payment Integration**: Razorpay payment gateway with custom implementation
- **Role-Based Access Control**: Comprehensive RBAC system with buyer, seller, and admin roles
- **Order Management**: Complete order tracking and management system
- **User Features**: Wishlist, cart, user profiles, and order history
- **Image Storage**: Cloudinary integration for efficient image management
- **Authentication**: Secure JWT-based authentication system

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Context API for state management
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT authentication
- Cloudinary for image uploads
- Razorpay for payments

## Use Cases

- Building a multi-vendor marketplace
- Implementing secure payment processing
- Creating role-based access control systems
- Developing e-commerce platforms with rental features
- Learning full-stack MERN development

## Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Environment Setup

Required environment variables:
- MongoDB connection string
- Cloudinary credentials
- Razorpay API keys
- JWT secret

## Running the Application

```bash
# Start server
cd server
npm start

# Start client (in another terminal)
cd client
npm run dev
```

## Skills Demonstrated

- Full-stack JavaScript development
- RESTful API design
- Authentication and authorization
- Payment gateway integration
- Cloud storage integration
- Database modeling and relationships
- Modern React patterns and hooks
- Responsive UI design
