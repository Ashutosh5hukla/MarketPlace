import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "buyer"
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update current user profile
// @route   PATCH /api/auth/me
// @access  Private
export const updateMe = async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'phone', 'address', 'bio', 'profileImage'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user stats
// @route   GET /api/auth/me/stats
// @access  Private
export const getMyStats = async (req, res) => {
  try {
    if (req.user.role === 'seller' || req.user.role === 'admin') {
      const productsListed = await Product.countDocuments({ seller: req.user._id });

      const orderCountResult = await Order.aggregate([
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        { $match: { 'product.seller': req.user._id } },
        { $group: { _id: '$_id' } },
        { $count: 'totalOrders' }
      ]);

      const pendingOrdersResult = await Order.aggregate([
        { $match: { status: 'pending' } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        { $match: { 'product.seller': req.user._id } },
        { $group: { _id: '$_id' } },
        { $count: 'pendingOrders' }
      ]);

      const totalOrders = orderCountResult[0]?.totalOrders || 0;
      const pendingOrders = pendingOrdersResult[0]?.pendingOrders || 0;

      const salesResult = await Order.aggregate([
        { $match: { $or: [{ paymentStatus: 'completed' }, { status: 'completed' }] } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        { $match: { 'product.seller': req.user._id } },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: { $multiply: ['$items.quantity', '$product.price'] }
            }
          }
        }
      ]);

      const totalSales = salesResult[0]?.totalSales || 0;

      return res.json({ totalOrders, productsListed, totalSales, pendingOrders });
    }

    const totalOrders = await Order.countDocuments({ buyer: req.user._id });
    return res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
