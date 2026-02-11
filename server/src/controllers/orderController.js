import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Buyer only)
export const createOrder = async (req, res) => {
  try {
    // Additional role check - sellers cannot place orders
    if (req.user.role === 'seller' || req.user.role === 'admin') {
      return res.status(403).json({ 
        message: "Sellers cannot place orders. Only buyers can purchase products." 
      });
    }

    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      buyer: req.user._id,
      items,
      totalAmount,
      status: "pending"
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("buyer", "name email")
      .populate("items.product");

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders for seller's products
// @route   GET /api/orders/seller
// @access  Private (Seller/Admin)
export const getSellerOrders = async (req, res) => {
  try {
    const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
    const productIds = sellerProducts.map((product) => product._id);

    if (productIds.length === 0) {
      return res.json([]);
    }

    const orders = await Order.find({ 'items.product': { $in: productIds } })
      .populate('buyer', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "name email")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is the buyer or admin
    if (order.buyer._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send message to order chat
// @route   POST /api/orders/:id/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const order = await Order.findById(req.params.id)
      .populate("buyer", "name email")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is the buyer or the seller of any product in the order
    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isSeller = order.items.some(item => 
      item.product.seller && item.product.seller.toString() === req.user._id.toString()
    );

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: "Not authorized to send messages for this order" });
    }

    // Only allow chat for completed payments
    if (order.paymentStatus !== "completed") {
      return res.status(403).json({ message: "Chat is only available for completed orders" });
    }

    order.messages.push({
      sender: req.user._id,
      message: message.trim(),
      timestamp: new Date()
    });

    await order.save();

    // Populate the sender info for the new message
    await order.populate("messages.sender", "name email");

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order messages
// @route   GET /api/orders/:id/messages
// @access  Private
export const getOrderMessages = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "name email")
      .populate("items.product")
      .populate("messages.sender", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is the buyer or the seller
    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isSeller = order.items.some(item => 
      item.product.seller && item.product.seller.toString() === req.user._id.toString()
    );

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: "Not authorized to view messages for this order" });
    }

    res.json(order.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
