import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Verify Cloudinary connection (dynamic import after dotenv)
(async () => {
  const { verifyCloudinary, configureCloudinary } = await import("./src/config/cloudinary.js");
  configureCloudinary();
  await verifyCloudinary();
  
  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  });
})();
