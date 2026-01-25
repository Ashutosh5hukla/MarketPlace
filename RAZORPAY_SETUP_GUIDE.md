# Razorpay Payment Integration Setup Guide

## 🎯 Overview
This guide will help you set up Razorpay payment integration for the ShopHub Marketplace application.

## 📋 Prerequisites
- Razorpay account (Sign up at https://razorpay.com/)
- Node.js and npm installed
- MongoDB running
- Application server running

## 🔑 Step 1: Get Razorpay API Keys

### For Test Mode (Development):
1. Go to https://dashboard.razorpay.com/signin
2. Sign up or log in to your Razorpay account
3. Navigate to **Settings** → **API Keys**
4. Click on **Generate Test Keys**
5. Copy the **Key ID** (starts with `rzp_test_`)
6. Copy the **Key Secret** (keep this confidential!)

### For Live Mode (Production):
1. Complete KYC verification
2. Navigate to **Settings** → **API Keys**
3. Click on **Generate Live Keys**
4. Copy the **Key ID** (starts with `rzp_live_`)
5. Copy the **Key Secret**

## 🛠️ Step 2: Configure Backend

### Update `.env` file in server directory:
```bash
# Navigate to server directory
cd server

# Copy example env file
cp .env.example .env

# Edit .env file and add:
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

### Example .env configuration:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/student-marketplace
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_1234567890abcdef
RAZORPAY_KEY_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## 🚀 Step 3: Test the Integration

### 1. Start the Backend Server:
```bash
cd server
npm start
# Server should start on http://localhost:5001
```

### 2. Start the Frontend:
```bash
cd client
npm run dev
# Client should start on http://localhost:3000
```

### 3. Test Payment Flow:

1. **Login to the application**
2. **Browse products** and click "View Details" on any product
3. **Click "Buy Now - Pay with Razorpay"**
4. **Razorpay checkout will open** with payment options

### 4. Use Test Card Details (Test Mode Only):

**Test Card Numbers:**
- **Success:** `4111 1111 1111 1111`
- **Failure:** `4012 0010 0000 0001`

**Card Details:**
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

**Test UPI ID:**
- Success: `success@razorpay`
- Failure: `failure@razorpay`

**Test Netbanking:**
- Select any bank and use the test credentials provided on the Razorpay test page

## 📁 Files Created/Modified

### Backend Files:
1. **`server/src/controllers/razorpayController.js`** - New file
   - `createRazorpayOrder()` - Creates Razorpay order
   - `verifyRazorpayPayment()` - Verifies payment signature
   - `getRazorpayKey()` - Returns public key

2. **`server/src/routes/orderRoutes.js`** - Modified
   - Added `/razorpay/create` endpoint
   - Added `/razorpay/verify` endpoint
   - Added `/razorpay/key` endpoint

3. **`server/src/models/Order.js`** - Modified
   - Added `paymentId` field
   - Added `orderId` field
   - Added `paymentStatus` field

4. **`server/.env.example`** - Modified
   - Added Razorpay configuration

### Frontend Files:
1. **`client/src/pages/ProductDetails.jsx`** - New file
   - Full product details page
   - Image gallery with thumbnails
   - Video player support
   - Razorpay integration
   - Add to cart functionality

2. **`client/src/api.js`** - Modified
   - Added `createRazorpayOrder()`
   - Added `verifyRazorpayPayment()`
   - Added `getRazorpayKey()`

3. **`client/src/App.jsx`** - Modified
   - Added `/product/:id` route

4. **`client/src/pages/Shop.jsx`** - Modified
   - Changed to navigate to product details page

5. **`client/src/pages/ProductList.jsx`** - Modified
   - Changed to navigate to product details page

### New Directories:
- **`client/public/images/products/`** - For storing product images

## 🔒 Security Best Practices

### ✅ DO:
- Store API keys in `.env` file
- Add `.env` to `.gitignore`
- Use test keys for development
- Verify payment signatures on backend
- Use HTTPS in production

### ❌ DON'T:
- Commit API keys to Git
- Share Key Secret publicly
- Use live keys in development
- Trust client-side payment data without verification

## 🧪 Testing Checklist

- [ ] Backend server running without errors
- [ ] Frontend loads product details page
- [ ] "Buy Now" button triggers Razorpay checkout
- [ ] Test payment with test card succeeds
- [ ] Payment verification works
- [ ] Order is created in database
- [ ] User is redirected to orders page
- [ ] Order appears in "My Orders"

## 🎨 Features Implemented

### Product Details Page:
- ✅ Full-screen product images with gallery
- ✅ Image navigation (left/right arrows)
- ✅ Thumbnail strip
- ✅ Video player (YouTube/Vimeo embed)
- ✅ Quantity selector
- ✅ Add to cart functionality
- ✅ Buy now with Razorpay integration
- ✅ Product specifications
- ✅ Damage condition display
- ✅ Seller information
- ✅ Responsive design

### Payment Features:
- ✅ Razorpay checkout integration
- ✅ Multiple payment methods (Card, UPI, Netbanking, Wallets)
- ✅ Order creation on successful payment
- ✅ Payment verification with signature
- ✅ Secure backend validation
- ✅ Order tracking

## 🐛 Troubleshooting

### Issue: "Razorpay SDK failed to load"
**Solution:** Check internet connection and ensure the script URL is accessible

### Issue: "Invalid API key"
**Solution:** 
1. Verify `.env` file has correct keys
2. Restart the server after updating `.env`
3. Check for extra spaces in key values

### Issue: "Payment verification failed"
**Solution:** 
1. Ensure `RAZORPAY_KEY_SECRET` is correct
2. Check backend logs for signature mismatch
3. Verify the order ID matches

### Issue: Orders not appearing
**Solution:**
1. Check MongoDB connection
2. Verify user is logged in
3. Check browser console for errors

## 📚 API Endpoints

### Create Razorpay Order
```
POST /api/orders/razorpay/create
Authorization: Bearer <token>

Body:
{
  "amount": 50000,        // Amount in paise (₹500)
  "currency": "INR",
  "receipt": "order_123",
  "productId": "product_id",
  "quantity": 1
}

Response:
{
  "success": true,
  "order": {
    "id": "order_xyz",
    "amount": 50000,
    "currency": "INR"
  },
  "key_id": "rzp_test_xxx"
}
```

### Verify Payment
```
POST /api/orders/razorpay/verify
Authorization: Bearer <token>

Body:
{
  "razorpay_order_id": "order_xyz",
  "razorpay_payment_id": "pay_abc",
  "razorpay_signature": "signature_hash",
  "productId": "product_id",
  "quantity": 1
}

Response:
{
  "success": true,
  "message": "Payment verified successfully",
  "order": { ... }
}
```

### Get Razorpay Key
```
GET /api/orders/razorpay/key

Response:
{
  "key_id": "rzp_test_xxx"
}
```

## 🌐 Production Deployment

### Before Going Live:
1. Complete Razorpay KYC verification
2. Generate Live API keys
3. Update production `.env` with live keys
4. Enable HTTPS on your domain
5. Test with small amounts first
6. Set up webhook for payment status updates
7. Implement proper error handling
8. Add email notifications for orders

## 📞 Support

### Razorpay Resources:
- Documentation: https://razorpay.com/docs/
- API Reference: https://razorpay.com/docs/api/
- Dashboard: https://dashboard.razorpay.com/
- Support: support@razorpay.com

### Common Links:
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-upi-details/
- Webhooks: https://razorpay.com/docs/webhooks/
- Payment Gateway: https://razorpay.com/docs/payment-gateway/

## 🎉 You're All Set!

Your marketplace now has a fully functional Razorpay payment integration. Users can:
- View detailed product pages
- See product images and videos
- Add items to cart
- Make secure payments via Razorpay
- Track their orders

**Happy Selling! 🚀**
