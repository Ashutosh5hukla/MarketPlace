import { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { formatINR } from '../utils/currency';

function PaymentModal({ isOpen, onClose, product, quantity, onSuccess }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = product.price * quantity;

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace(/\//g, '').length <= 4) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const validateForm = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardHolder || cardHolder.length < 3) {
      setError('Please enter the card holder name');
      return false;
    }
    if (!expiryDate || expiryDate.length !== 5) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    const [month, year] = expiryDate.split('/');
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      setError('Invalid expiry month');
      return false;
    }
    if (!cvv || cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment success (in real app, this would call backend)
      const paymentData = {
        cardNumber: cardNumber.slice(-4), // Only last 4 digits
        cardHolder: cardHolder,
        amount: totalAmount,
        productId: product._id,
        quantity: quantity,
        timestamp: new Date().toISOString(),
      };

      onSuccess(paymentData);
    } catch (err) {
      setError('Payment failed. Please try again.');
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
              <h2 className="text-xl font-bold text-white">Secure Payment</h2>
              <p className="text-white/80 text-sm">Complete your purchase</p>
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
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">{product.title}</span>
            <span className="text-gray-900 font-semibold">{formatINR(product.price)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">Quantity</span>
            <span className="text-gray-900 font-semibold">× {quantity}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-300">
            <span className="text-gray-900 font-bold">Total Amount</span>
            <span className="text-2xl font-extrabold text-primary-600">{formatINR(totalAmount)}</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Card Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                disabled={processing}
                className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-colors disabled:bg-gray-100"
              />
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Card Holder */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Card Holder Name
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              placeholder="JOHN DOE"
              disabled={processing}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-colors disabled:bg-gray-100"
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                disabled={processing}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-colors disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="password"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                disabled={processing}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-colors disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700">
              Your payment information is encrypted and secure
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Pay {formatINR(totalAmount)}
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;
