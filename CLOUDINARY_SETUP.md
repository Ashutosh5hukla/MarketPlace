# Cloudinary Setup Guide for ShopHub

## Overview
Cloudinary has been integrated to store and manage product images with automatic optimization and transformation.

## Setup Steps

### 1. Create a Cloudinary Account
1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your Cloudinary Credentials
1. After logging in, go to your Dashboard
2. You'll find your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Configure Environment Variables
Update your `server/.env` file with your Cloudinary credentials:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Important:** Replace the placeholder values with your actual Cloudinary credentials.

### 4. Restart the Server
After updating the `.env` file, restart your backend server:

```bash
cd server
npm run dev
```

## Features Implemented

### Backend
- ✅ Cloudinary SDK configured
- ✅ Multer middleware for file uploads
- ✅ Upload routes (`/api/upload/image` and `/api/upload/images`)
- ✅ Image optimization (max 1200x1200, auto quality)
- ✅ File size limit: 5MB per image
- ✅ Supported formats: JPG, JPEG, PNG, WEBP, GIF
- ✅ Images stored in `shophub-products` folder

### Frontend
- ✅ Upload API functions added to `api.js`
- ✅ CreateProduct component updated to upload to Cloudinary
- ✅ Images uploaded before product creation
- ✅ Image URLs stored in database

## Usage

### Creating a Product with Images
1. User selects images (up to 5)
2. Images are previewed locally
3. On form submit:
   - Images are uploaded to Cloudinary
   - Cloudinary returns URLs
   - Product is created with image URLs
   - Images are displayed from Cloudinary

## Storage Structure
- Folder: `shophub-products/`
- Images are automatically optimized
- Public IDs are stored for future deletion capability

## Benefits
- ✅ Fast CDN delivery
- ✅ Automatic image optimization
- ✅ Responsive image transformations
- ✅ No server storage needed
- ✅ Free tier: 25GB storage, 25GB bandwidth

## Next Steps (Optional Enhancements)
1. Add image deletion when product is deleted
2. Implement image transformation for different sizes
3. Add lazy loading for images
4. Implement image compression before upload

## Testing
1. Create a new product
2. Upload images
3. Check Cloudinary dashboard to see uploaded images
4. Verify images display correctly on product cards and details

## Troubleshooting

### Images not uploading?
- Check that `.env` has correct credentials
- Verify server restarted after updating `.env`
- Check browser console for errors
- Ensure images are under 5MB

### Images not displaying?
- Check network tab for image URLs
- Verify URLs in database are correct
- Check Cloudinary dashboard for uploaded files

## Free Tier Limits
- Storage: 25 GB
- Bandwidth: 25 GB/month
- Transformations: 25 credits/month
- This is sufficient for development and small-medium projects
