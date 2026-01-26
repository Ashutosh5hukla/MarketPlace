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
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, authorize("admin"), getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

// Chat routes
router.post("/:id/messages", protect, sendMessage);
router.get("/:id/messages", protect, getOrderMessages);

// Payment routes
router.post("/payment/process", protect, processPayment);

export default router;
