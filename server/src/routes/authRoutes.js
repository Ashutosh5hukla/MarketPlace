import express from "express";
import { register, login, getMe, updateMe, getMyStats } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.get("/me/stats", protect, getMyStats);

export default router;
