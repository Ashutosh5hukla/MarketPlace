# Razorpay Integration Setup Guide

## ✅ Integration Complete

Razorpay payment gateway has been successfully integrated into your Student Marketplace application.

## 🔑 Configuration Required

You need to add your Razorpay credentials to the `.env` file in the `server` directory.

### Steps to Configure:

1. **Get Your Razorpay Keys:**
   - Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Go to Settings → API Keys
   - Generate keys if you haven't already
   - You'll get:
     - `Key ID` (starts with `rzp_test_` for test mode or `rzp_live_` for live mode)
     - `Key Secret`

2. **Update the `.env` file:**
   
   Open `server/.env` and replace the placeholder values:

   ```env
   # Razorpay Configuration
   RAZORPAY_KEY_ID=your_actual_key_id_here
   RAZORPAY_KEY_SECRET=your_actual_key_secret_here
   ```

   **Example:**
   ```env
   RAZORPAY_KEY_ID=rzp_test_1234567890abcd
   RAZORPAY_KEY_SECRET=abcdefghijklmnopqrstuvwxyz123456
   ```

3. **Restart the Server:**
   ```bash
   cd server
   npm run dev
   ```

## 🎯 Features Implemented

### Backend (Server)
- ✅ Razorpay SDK installed and configured
- ✅ Create Razorpay order endpoint (`POST /api/orders/razorpay/create`)
- ✅ Verify Razorpay payment endpoint (`POST /api/orders/razorpay/verify`)
- ✅ Get Razorpay key endpoint (`GET /api/orders/razorpay/key`)
- ✅ Signature verification for payment security
- ✅ Order creation after successful payment

### Frontend (Client)
- ✅ RazorpayPaymentModal component created
- ✅ Razorpay Checkout integration
- ✅ Dynamic Razorpay script loading
- ✅ Payment verification flow
- ✅ Updated Cart.jsx to use Razorpay
- ✅ Updated ProductDetails.jsx to use Razorpay
- ✅ Support for multiple payment methods (Cards, UPI, Net Banking, Wallets)

## 🔒 Security Features

- ✅ Payment signature verification
- ✅ Server-side amount validation
- ✅ Secure order creation
- ✅ Protected routes (buyer-only access)
- ✅ JWT authentication required

## 📱 Payment Flow

1. **User clicks "Buy Now" or "Checkout"**
   → RazorpayPaymentModal opens

2. **Modal creates Razorpay order**
   → Backend generates order with amount and receipt

3. **Razorpay Checkout opens**
   → User selects payment method and completes payment

4. **Payment success callback**
   → Frontend receives payment details

5. **Payment verification**
   → Backend verifies signature and creates order in database

6. **Order confirmation**
   → User sees success message and order details

## 🧪 Testing

### Test Mode (Recommended for Development)
Use Razorpay test credentials for development:
- Test cards, UPI, and other payment methods work without real money
- Full documentation: https://razorpay.com/docs/payments/payments/test-card-details/

### Test Card Details:
- **Card Number:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date

## 🎨 Supported Payment Methods

The integration supports all Razorpay payment methods:
- 💳 Credit Cards (Visa, Mastercard, American Express, etc.)
- 💳 Debit Cards
- 🏦 Net Banking (all major banks)
- 📱 UPI (Google Pay, PhonePe, Paytm, etc.)
- 👛 Wallets (Paytm, Mobikwik, etc.)
- 💰 EMI options
- 📲 Cardless EMI

## 🔗 API Endpoints

### Get Razorpay Key
```
GET /api/orders/razorpay/key
```
Returns the Razorpay Key ID for client-side integration.

### Create Order
```
POST /api/orders/razorpay/create
Authorization: Bearer <token>

Body:
{
  "amount": 1000,
  "currency": "INR",
  "receipt": "receipt_123"
}
```

### Verify Payment
```
POST /api/orders/razorpay/verify
Authorization: Bearer <token>

Body:
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "productId": "product_id",
  "quantity": 1,
  "totalAmount": 1000
}
```

## 📝 Important Notes

1. **Environment Variables:** Never commit `.env` file to version control
2. **Test vs Live:** Use test keys for development, live keys only for production
3. **Webhook Setup:** Consider adding webhooks for payment notifications (optional)
4. **Order Status:** Orders are automatically marked as "completed" after successful payment
5. **Role-Based Access:** Only buyers can make payments (sellers cannot purchase)

## 🚀 Next Steps

1. Add your Razorpay keys to `.env`
2. Restart the server
3. Test the payment flow with test credentials
4. Go live when ready with production keys

## 📞 Support

- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/

## 🎉 Ready to Use!

Once you add your Razorpay keys, the payment gateway is ready to accept payments!
