import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// --------------------------------------------------
// CLOUDINARY CONFIGURATION FUNCTION
// Must be called after dotenv loads environment variables
// --------------------------------------------------
export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  
  console.log('✅ Cloudinary configured with:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'missing'
  });
};

// --------------------------------------------------
// VERIFY CLOUDINARY CONNECTION
// --------------------------------------------------
export const verifyCloudinary = async () => {
  try {
    // Check if credentials are loaded from environment
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Missing Cloudinary credentials in .env file');
    }
    
    console.log(`🔍 Checking Cloudinary connection...`);
    console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    
    // Test with a simple upload operation - explicitly pass config
    const testResult = await cloudinary.uploader.upload(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      {
        folder: 'shophub-products',
        public_id: 'test_connection',
        overwrite: true,
      }
    );
    
    // Delete the test image
    await cloudinary.uploader.destroy(`shophub-products/test_connection`);
    
    console.log("✅ Cloudinary Connected Successfully");
    return true;
  } catch (error) {
    console.error("❌ Cloudinary Connection Error:", error.message || error);
    
    // More detailed error info
    if (error.error && error.error.message) {
      console.error("   Details:", error.error.message);
    }
    
    console.log("\n⚠️  Troubleshooting:");
    console.log("   1. Verify credentials at: https://console.cloudinary.com");
    console.log("   2. Make sure API Key has not been deleted/regenerated");
    console.log("   3. Check if your Cloudinary account is active");
    console.log(`   4. Current credentials being used:`);
    console.log(`      - Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`      - API Key: ${process.env.CLOUDINARY_API_KEY}`);
    
    return false;
  }
};

// --------------------------------------------------
// MULTER CLOUDINARY STORAGE
// --------------------------------------------------
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "shophub-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

// --------------------------------------------------
// MULTER UPLOAD MIDDLEWARE
// --------------------------------------------------
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// --------------------------------------------------
export default cloudinary;
