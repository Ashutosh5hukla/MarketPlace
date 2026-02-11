import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Product from "./src/models/Product.js";
import ChatMessage from "./src/models/ChatMessage.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Verify Cloudinary connection (dynamic import after dotenv)
(async () => {
  const { verifyCloudinary, configureCloudinary } = await import("./src/config/cloudinary.js");
  configureCloudinary();
  await verifyCloudinary();
  
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: [process.env.CORS_ORIGIN || 'http://localhost:3000', 'http://localhost:3003', 'http://localhost:3006'],
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: decoded.id };
      return next();
    } catch (error) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinProductChat', async ({ productId, buyerId }) => {
      try {
        const product = await Product.findById(productId).select('seller');
        if (!product) return;

        const sellerId = product.seller.toString();
        const userId = socket.user.id;
        let resolvedBuyerId = userId;

        if (userId === sellerId) {
          if (!buyerId) return;
          resolvedBuyerId = buyerId;
        }

        const roomId = `product:${productId}:buyer:${resolvedBuyerId}`;
        socket.join(roomId);
      } catch (error) {
        console.error('joinProductChat error:', error.message);
      }
    });

    socket.on('sendProductMessage', async ({ productId, buyerId, text }) => {
      try {
        if (!text || !text.trim()) return;

        const product = await Product.findById(productId).select('seller');
        if (!product) return;

        const sellerId = product.seller.toString();
        const userId = socket.user.id;
        let resolvedBuyerId = userId;

        if (userId === sellerId) {
          if (!buyerId) return;
          resolvedBuyerId = buyerId;
        }

        const message = await ChatMessage.create({
          product: productId,
          seller: sellerId,
          buyer: resolvedBuyerId,
          sender: userId,
          message: text.trim()
        });

        const payload = {
          _id: message._id,
          product: productId,
          seller: sellerId,
          buyer: resolvedBuyerId,
          sender: userId,
          message: message.message,
          createdAt: message.createdAt
        };

        const roomId = `product:${productId}:buyer:${resolvedBuyerId}`;
        io.to(roomId).emit('productChatMessage', payload);
      } catch (error) {
        console.error('sendProductMessage error:', error.message);
      }
    });
  });

  // Start server
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  });
})();
