import { useState, useEffect } from 'react';
import { X, CreditCard, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { formatINR } from '../utils/currency';
import { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKey } from '../api';

function RazorpayPaymentModal({ isOpen, onClose, product, quantity, onSuccess }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [razorpayKey, setRazorpayKey] = useState('');

  const totalAmount = product.price * quantity;

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch Razorpay key
    fetchRazorpayKey();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchRazorpayKey = async () => {
    try {
      const response = await getRazorpayKey();
      setRazorpayKey(response.key);
    } catch (err) {
      console.error('Error fetching Razorpay key:', err);
      setError('Failed to initialize payment gateway');
    }
  };

  const handlePayment = async () => {
    if (!razorpayKey) {
      setError('Payment gateway not initialized');
      return;
    }

    setError('');
    setProcessing(true);

    try {
      // Create Razorpay order
      const orderResponse = await createRazorpayOrder({
        amount: totalAmount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });

      if (!orderResponse.success) {
        throw new Error('Failed to create order');
      }

      const { order } = orderResponse;

      // Razorpay checkout options
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Student Marketplace',
        description: product.title,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              productId: product._id,
              quantity: quantity,
              totalAmount: totalAmount,
            });

            if (verifyResponse.success) {
              onSuccess({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                order: verifyResponse.order,
              });
              setProcessing(false);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            setError('Payment verification failed. Please contact support.');
            setProcessing(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Razorpay Payment</h2>
              <p className="text-white/80 text-sm">Secure checkout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Summary</h3>
          <div className="flex items-center gap-4 mb-3">
            {product.images && product.images[0] && (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <p className="text-gray-900 font-semibold">{product.title}</p>
              <p className="text-gray-600 text-sm">{formatINR(product.price)} × {quantity}</p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-300">
            <span className="text-gray-900 font-bold">Total Amount</span>
            <span className="text-2xl font-extrabold text-primary-600">{formatINR(totalAmount)}</span>
          </div>
        </div>

        {/* Payment Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Safe & Secure Payment</h4>
                <p className="text-sm text-blue-700">
                  You will be redirected to Razorpay's secure payment gateway. Razorpay supports:
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                  <li>Credit & Debit Cards</li>
                  <li>Net Banking</li>
                  <li>UPI</li>
                  <li>Wallets & More</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Test Mode Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">🧪 Test Mode - Use These Methods</h4>
                <div className="text-sm text-yellow-800 space-y-3">
                  
                  <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-300">
                    <p className="font-bold text-yellow-900 mb-2">✅ RECOMMENDED: Test UPI (Easiest)</p>
                    <p className="font-mono text-xs">1. Click "Pay" button below</p>
                    <p className="font-mono text-xs">2. Select "UPI" option</p>
                    <p className="font-mono text-xs">3. Enter: success@razorpay</p>
                    <p className="font-mono text-xs">4. Click Pay</p>
                  </div>

                  <div>
                    <p className="font-bold text-yellow-900 mb-1">Alternative: Test Net Banking</p>
                    <p className="text-xs">Select any bank and use test credentials</p>
                  </div>

                  <div>
                    <p className="font-bold text-yellow-900 mb-1">Test Cards (if available):</p>
                    <p className="font-mono text-xs bg-yellow-100 px-2 py-1 rounded">5267 3181 8797 5449</p>
                    <p className="text-xs mt-1">CVV: Any 3 digits | Expiry: Any future date</p>
                  </div>

                  <p className="text-xs text-yellow-700 mt-2 font-medium">
                    ⚠️ Note: No real money will be charged - this is test mode only
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={processing || !razorpayKey}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay {formatINR(totalAmount)}
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default RazorpayPaymentModal;
