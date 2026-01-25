import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  condition: { 
    type: String, 
    enum: ['New', 'Like New', 'Good', 'Fair', 'Used'],
    default: 'New'
  },
  damageCondition: {
    level: {
      type: String,
      enum: ['None', 'Minor', 'Moderate', 'Heavy'],
      default: 'None'
    },
    description: String
  },
  images: [{
    url: { type: String, required: true },
    isMain: { type: Boolean, default: false }
  }],
  videoUrl: String,
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

// Index for better performance
productSchema.index({ price: 1, category: 1, seller: 1 });

// Virtual for main image
productSchema.virtual('mainImage').get(function() {
  if (!this.images || this.images.length === 0) return null;
  
  // Handle both formats: string array and object array
  const images = this.images.map(img => 
    typeof img === 'string' ? { url: img, isMain: false } : img
  );
  
  const mainImg = images.find(img => img.isMain);
  return mainImg ? mainImg.url : (images[0] ? images[0].url : null);
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model("Product", productSchema);
