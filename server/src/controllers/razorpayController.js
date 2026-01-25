import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

// Initialize Razorpay instance
// NOTE: Replace these with your actual Razorpay credentials
// Demo mode uses dummy keys for testing UI without real Razorpay account
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_demo123456789",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "demo_secret_key_12345678",
});

// @desc    Create Razorpay order
// @route   POST /api/orders/razorpay/create
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, productId, quantity } = req.body;

    const options = {
      amount: amount, // amount in paise
      currency: currency || "INR",
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID",
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};

// @desc    Verify Razorpay payment and create order
// @route   POST /api/orders/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      quantity,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "YOUR_RAZORPAY_KEY_SECRET")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified, create order in database
      const order = await Order.create({
        user: req.user.id,
        product: productId,
        quantity: quantity || 1,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        paymentStatus: "completed",
      });

      await order.populate([
        { path: "user", select: "name email" },
        { path: "product", select: "title price" },
      ]);

      res.json({
        success: true,
        message: "Payment verified successfully",
        order,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// @desc    Get Razorpay Key ID
// @route   GET /api/orders/razorpay/key
// @access  Public
export const getRazorpayKey = async (req, res) => {
  try {
    res.json({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_demo123456789",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
