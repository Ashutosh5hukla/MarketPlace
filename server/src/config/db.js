import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`⚠️  Please whitelist your IP in MongoDB Atlas or use local MongoDB`);
    // Don't exit - let server run for API testing
  }
};

export default connectDB;
