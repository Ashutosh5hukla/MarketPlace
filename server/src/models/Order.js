import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    quantity: Number
  }],
  quantity: {
    type: Number,
    default: 1
  },
  totalAmount: Number,
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending"
  },
  paymentId: String,
  orderId: String,
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
