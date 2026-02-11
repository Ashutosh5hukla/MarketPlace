import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

chatMessageSchema.index({ product: 1, buyer: 1, seller: 1, createdAt: 1 });

export default mongoose.model("ChatMessage", chatMessageSchema);
