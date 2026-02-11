import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  bio: { type: String, default: '' },
  role: {
    type: String,
    enum: ["buyer", "seller", "admin"],
    default: "buyer"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
