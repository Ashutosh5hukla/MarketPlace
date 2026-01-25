import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/orderController.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey
} from "../controllers/razorpayController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, authorize("admin"), getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

// Razorpay routes
router.post("/razorpay/create", protect, createRazorpayOrder);
router.post("/razorpay/verify", protect, verifyRazorpayPayment);
router.get("/razorpay/key", getRazorpayKey);

export default router;
