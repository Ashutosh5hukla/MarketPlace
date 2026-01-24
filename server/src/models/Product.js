import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  images: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

// Index for better performance
productSchema.index({ price: 1, category: 1 });

export default mongoose.model("Product", productSchema);
