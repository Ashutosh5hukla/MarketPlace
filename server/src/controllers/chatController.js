import ChatMessage from "../models/ChatMessage.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// @desc    Get all chats for seller's products
// @route   GET /api/chat/seller
// @access  Private (Seller only)
export const getSellerChats = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get all products for this seller
    const products = await Product.find({ seller: sellerId }).select("name mainImage");

    const productsWithChats = [];

    for (const product of products) {
      // Get unique buyers who have chatted about this product
      const buyers = await ChatMessage.find({ 
        product: product._id,
        seller: sellerId 
      })
        .distinct("buyer");

      const buyerDetails = await User.find({ _id: { $in: buyers } })
        .select("name profileImage");

      // Get last message for each buyer
      const chatsWithBuyers = [];
      for (const buyer of buyerDetails) {
        const lastMessage = await ChatMessage.findOne({
          product: product._id,
          seller: sellerId,
          buyer: buyer._id
        })
          .sort({ createdAt: -1 })
          .populate("sender", "name");

        if (lastMessage) {
          chatsWithBuyers.push({
            buyerId: buyer._id,
            buyerName: buyer.name,
            buyerImage: buyer.profileImage,
            lastMessage: lastMessage.message,
            lastMessageTime: lastMessage.createdAt,
            lastSender: lastMessage.sender.name
          });
        }
      }

      if (chatsWithBuyers.length > 0) {
        productsWithChats.push({
          _id: product._id,
          name: product.name,
          mainImage: product.mainImage,
          chats: chatsWithBuyers
        });
      }
    }

    res.json(productsWithChats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product chat messages for buyer or seller
// @route   GET /api/chat/product/:productId
// @access  Private
export const getProductChat = async (req, res) => {
  try {
    const { productId } = req.params;
    const { buyerId } = req.query;

    const product = await Product.findById(productId).select("seller");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const sellerId = product.seller.toString();
    const userId = req.user._id.toString();

    let resolvedBuyerId = userId;
    if (userId === sellerId) {
      if (!buyerId) {
        return res.status(400).json({ message: "buyerId is required for sellers" });
      }
      resolvedBuyerId = buyerId;
    }

    const messages = await ChatMessage.find({
      product: productId,
      seller: sellerId,
      buyer: resolvedBuyerId
    })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
