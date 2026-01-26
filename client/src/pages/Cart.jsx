import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { processPayment } from '../api';
import { formatINR } from '../utils/currency';
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, Tag, Calendar, Clock, AlertCircle, Sparkles, IndianRupee } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Ensure each item has a unique cartId
    const cartWithIds = cart.map(item => ({
      ...item,
      cartId: item.cartId || `${item._id}_${Date.now()}_${Math.random()}`
    }));
    setCartItems(cartWithIds);
    // Update localStorage with cartIds
    localStorage.setItem('cart', JSON.stringify(cartWithIds));
  };

  const removeFromCart = (cartId) => {
    const updatedCart = cartItems.filter(item => item.cartId !== cartId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.cartId === cartId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.type === 'rental' ? item.rentalPrice : (item.price || 0);
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Open payment modal for entire cart
    setSelectedItem(null);
    setShowPaymentModal(true);
  };

  const handleBuyNow = (item) => {
    // Open payment modal for specific item
    setSelectedItem(item);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    setIsProcessing(true);
    
    try {
      let totalAmount;
      let paymentPayload;

      // Check if buying single item or entire cart
      if (selectedItem) {
        // Single item purchase
        totalAmount = (selectedItem.type === 'rental' ? selectedItem.rentalPrice : selectedItem.price) * (selectedItem.quantity || 1);
        paymentPayload = {
          ...paymentData,
          productId: selectedItem._id,
          quantity: selectedItem.quantity || 1,
          totalAmount: totalAmount
        };
      } else {
        // Full cart checkout
        totalAmount = parseFloat(getTotalPrice());
        paymentPayload = {
          ...paymentData,
          cartItems: cartItems.map(item => ({
            productId: item._id,
            quantity: item.quantity || 1,
            price: item.type === 'rental' ? item.rentalPrice : (item.price || 0)
          })),
          totalAmount: totalAmount
        };
      }

      // Process payment with backend
      const response = await processPayment(paymentPayload);

      if (response.success) {
        setShowPaymentModal(false);
        
        // Remove purchased items from cart
        if (selectedItem) {
          // Remove only the purchased item
          removeFromCart(selectedItem.cartId);
          alert('Payment successful! Your order has been placed.');
        } else {
          // Remove all items (full cart checkout)
          clearCart();
          alert('Payment successful! Your order has been placed.');
        }
        
        navigate('/orders');
      } else {
        throw new Error(response.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Error processing payment: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const getDurationLabel = (duration) => {
    switch(duration) {
      case 'day': return '1 Day';
      case 'week': return '1 Week';
      case 'month': return '1 Month';
      default: return duration;
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-primary-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 text-lg mb-8">Add some products to get started!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-3.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
                onClick={() => navigate('/shop')}
              >
                <ShoppingBag className="w-5 h-5 inline mr-2" />
                Browse Shop
              </button>
              <button 
                className="px-8 py-3.5 bg-white text-primary-600 font-semibold rounded-xl border-2 border-primary-500 hover:bg-primary-50 transition-all"
                onClick={() => navigate('/rent')}
              >
                <Tag className="w-5 h-5 inline mr-2" />
                Browse Rentals
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Shopping Cart
          </h1>
          <button 
            className="px-6 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all hover:-translate-y-0.5"
            onClick={clearCart}
          >
            <Trash2 className="w-4 h-4 inline mr-2" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.cartId} 
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    {item.images && item.images.length > 0 ? (
                      <img 
                        src={typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url} 
                        alt={item.title || item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : item.mainImage ? (
                      <img 
                        src={item.mainImage} 
                        alt={item.title || item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {item.type === 'rental' && (
                      <span className="absolute bottom-2 left-2 bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm bg-opacity-90">
                        RENTAL
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    {/* Product Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.title || item.name}
                    </h3>
                    
                    {/* Rental Info or Description */}
                    {item.type === 'rental' ? (
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center text-primary-600">
                          <Clock className="w-4 h-4 mr-1.5" />
                          <span className="text-sm font-medium">
                            Duration: {item.rentalDuration}
                          </span>
                        </div>
                        {item.rentalStartDate && (
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-1.5" />
                            <span className="text-sm">
                              From: {new Date(item.rentalStartDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Category & Condition */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-semibold rounded-full">
                        {item.category || 'General'}
                      </span>
                      {item.condition && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                          {item.condition}
                        </span>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mt-auto">
                      <div className="text-2xl font-extrabold text-primary-600">
                        {formatINR(item.type === 'rental' ? item.rentalPrice : item.price)}
                        {item.type === 'rental' && (
                          <span className="text-sm font-medium text-gray-600 ml-1">
                            / {item.rentalDuration}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Quantity Control */}
                        {!item.type || item.type !== 'rental' ? (
                          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                            <button 
                              className="w-9 h-9 flex items-center justify-center bg-white rounded-lg text-primary-600 font-bold hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                              onClick={() => updateQuantity(item.cartId, (item.quantity || 1) - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-gray-900">
                              {item.quantity || 1}
                            </span>
                            <button 
                              className="w-9 h-9 flex items-center justify-center bg-white rounded-lg text-primary-600 font-bold hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                              onClick={() => updateQuantity(item.cartId, (item.quantity || 1) + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="bg-gray-100 px-4 py-2 rounded-xl font-semibold text-gray-700">
                            Qty: 1
                          </div>
                        )}

                        {/* Buy Now Button */}
                        <button
                          className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all text-sm"
                          onClick={() => handleBuyNow(item)}
                        >
                          Buy Now
                        </button>

                        {/* Remove Button */}
                        <button 
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all hover:scale-110"
                          onClick={() => removeFromCart(item.cartId)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Items ({cartItems.length})</span>
                  <span className="font-semibold">{formatINR(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
              </div>
              
              <div className="h-px bg-gray-200 mb-6"></div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-3xl font-extrabold text-primary-600">{formatINR(getTotalPrice())}</span>
              </div>

              <button 
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all mb-3"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>

              <button 
                className="w-full py-3.5 bg-white text-primary-600 font-semibold rounded-xl border-2 border-primary-500 hover:bg-primary-50 transition-all"
                onClick={() => navigate('/shop')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => !isProcessing && setShowPaymentModal(false)}
            product={
              selectedItem 
                ? {
                    title: selectedItem.title || selectedItem.name,
                    price: (selectedItem.type === 'rental' ? selectedItem.rentalPrice : selectedItem.price) * (selectedItem.quantity || 1)
                  }
                : {
                    title: `Cart Items (${cartItems.length} items)`,
                    price: parseFloat(getTotalPrice())
                  }
            }
            quantity={1}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default Cart;
