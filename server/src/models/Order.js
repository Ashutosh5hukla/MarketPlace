import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    quantity: Number
  }],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
