import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Get Razorpay instance (lazy initialization)
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file");
  }
  
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc    Get Razorpay key
// @route   GET /api/payments/razorpay/key
// @access  Public
export const getRazorpayKey = async (req, res) => {
  try {
    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error fetching Razorpay key:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Razorpay key",
    });
  }
};

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay/create-order
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const razorpay = getRazorpayInstance();
    
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
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

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      quantity,
      totalAmount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Get product to verify amount
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Create order in database
    const order = await Order.create({
      user: req.user._id,
      buyer: req.user._id,
      items: [
        {
          product: productId,
          quantity: quantity,
        },
      ],
      totalAmount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: "completed",
      status: "completed",
    });

    await order.populate([
      { path: "buyer", select: "name email" },
      { path: "items.product" },
    ]);

    res.json({
      success: true,
      message: "Payment verified successfully",
      order,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// @desc    Process custom payment (fallback)
// @route   POST /api/payments/process
// @access  Private
export const processPayment = async (req, res) => {
  try {
    const { productId, quantity, totalAmount, cardNumber, cardHolder, timestamp } = req.body;

    if (!productId || !quantity || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment information"
      });
    }

    // Get product to verify amount
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Verify amount matches
    const calculatedAmount = product.price * quantity;
    if (Math.abs(calculatedAmount - totalAmount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: "Amount mismatch"
      });
    }

    // Generate payment ID and order ID
    const paymentId = `PAY_${crypto.randomBytes(12).toString('hex').toUpperCase()}`;
    const orderId = `ORD_${crypto.randomBytes(12).toString('hex').toUpperCase()}`;

    // Create order in database
    const order = await Order.create({
      user: req.user._id,
      buyer: req.user._id,
      items: [
        {
          product: productId,
          quantity: quantity,
        },
      ],
      totalAmount,
      paymentId,
      orderId,
      paymentStatus: "completed",
      status: "completed",
    });

    await order.populate([
      { path: "buyer", select: "name email" },
      { path: "items.product" },
    ]);

    res.json({
      success: true,
      message: "Payment processed successfully",
      order,
      paymentId,
      orderId
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment processing failed",
      error: error.message,
    });
  }
};
