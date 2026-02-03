import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  sendMessage,
  getOrderMessages
} from "../controllers/orderController.js";
import {
  processPayment
} from "../controllers/paymentController.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey
} from "../controllers/razorpayController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Buyer-only routes - sellers cannot place orders
router.post("/", protect, authorize("buyer"), createOrder);
router.get("/my", protect, authorize("buyer"), getMyOrders);

// Admin-only routes
router.get("/", protect, authorize("admin"), getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

// Chat routes
router.post("/:id/messages", protect, sendMessage);
router.get("/:id/messages", protect, getOrderMessages);

// Payment routes
router.post("/payment/process", protect, processPayment);

// Razorpay routes - buyer only (sellers don't purchase)
router.post("/razorpay/create", protect, authorize("buyer"), createRazorpayOrder);
router.post("/razorpay/verify", protect, authorize("buyer"), verifyRazorpayPayment);
router.get("/razorpay/key", getRazorpayKey);

export default router;
