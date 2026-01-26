import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Tag, Clock, Calendar } from 'lucide-react';
import { formatINR } from '../utils/currency';

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadWishlist();

    // Listen for wishlist updates
    const handleWishlistUpdate = () => loadWishlist();
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  const loadWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(wishlist);
  };

  const removeFromWishlist = (productId) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updatedWishlist = wishlist.filter(item => item._id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist);
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ 
        ...item, 
        quantity: 1,
        cartId: `${item._id}_${Date.now()}`
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert('Added to cart!');
  };

  const clearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      localStorage.setItem('wishlist', JSON.stringify([]));
      setWishlistItems([]);
      window.dispatchEvent(new Event('wishlistUpdated'));
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-8">
            My Wishlist
          </h1>
          
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
            <Heart className="w-32 h-32 text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 text-center mb-8 max-w-md">
              Start adding products you love to your wishlist and keep track of items you want to purchase later!
            </p>
            <button
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              onClick={() => navigate('/shop')}
            >
              Browse Products
            </button>
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
            My Wishlist
            <span className="text-lg font-medium text-gray-600 ml-3">
              ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
            </span>
          </h1>
          <button 
            className="px-6 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all hover:-translate-y-0.5"
            onClick={clearWishlist}
          >
            <Trash2 className="w-4 h-4 inline mr-2" />
            Clear Wishlist
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {wishlistItems.map((item) => (
            <div 
              key={item._id} 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all overflow-hidden group"
            >
              {/* Product Image */}
              <div 
                className="relative h-64 bg-gray-100 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                {item.images && item.images.length > 0 ? (
                  <img 
                    src={typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url} 
                    alt={item.title || item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : item.mainImage ? (
                  <img 
                    src={item.mainImage} 
                    alt={item.title || item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                
                {item.type === 'rental' && (
                  <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm bg-opacity-90">
                    RENTAL
                  </span>
                )}
                
                {/* Remove from Wishlist Button */}
                <button
                  className="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-all group/heart"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(item._id);
                  }}
                >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500 group-hover/heart:scale-110 transition-transform" />
                </button>
              </div>

              {/* Product Details */}
              <div className="p-5">
                <h3 
                  className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-primary-600 transition-colors line-clamp-2"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  {item.title || item.name}
                </h3>

                {/* Rental Info */}
                {item.type === 'rental' && (
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-primary-600 text-sm">
                      <Clock className="w-4 h-4 mr-1.5" />
                      <span className="font-medium">
                        Duration: {item.rentalDuration}
                      </span>
                    </div>
                  </div>
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

                {/* Price */}
                <div className="text-2xl font-extrabold text-primary-600 mb-4">
                  {formatINR(item.type === 'rental' ? item.rentalPrice : item.price)}
                  {item.type === 'rental' && (
                    <span className="text-sm font-medium text-gray-600 ml-1">
                      / {item.rentalDuration}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                    onClick={() => addToCart(item)}
                  >
                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                    Add to Cart
                  </button>
                  <button
                    className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                    onClick={() => removeFromWishlist(item._id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
