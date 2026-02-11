import express from "express";
import { getProductChat, getSellerChats } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/seller", protect, getSellerChats);
router.get("/product/:productId", protect, getProductChat);

export default router;
