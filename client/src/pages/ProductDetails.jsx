import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProductById, createOrder, processPayment } from '../api';
import { formatINR } from '../utils/currency';
import PaymentModal from '../components/PaymentModal';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Package, 
  Shield, 
  Truck, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Video,
  User,
  MapPin,
  CheckCircle2,
  CreditCard,
  MessageCircle
} from 'lucide-react';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isSeller } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
    checkWishlistStatus();
  }, [id]);

  const checkWishlistStatus = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(wishlist.some(item => item._id === id));
  };

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter(item => item._id !== product._id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
      window.dispatchEvent(new Event('wishlistUpdated'));
      alert('Removed from wishlist');
    } else {
      // Add to wishlist
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsInWishlist(true);
      window.dispatchEvent(new Event('wishlistUpdated'));
      alert('Added to wishlist!');
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const allImages = product?.images && product.images.length > 0 
    ? product.images.map(img => typeof img === 'string' ? img : img.url)
    : product?.mainImage 
      ? [product.mainImage]
      : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const getVideoEmbedUrl = (url) => {
    if (!url) return null;
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  };

  const handleBuyNow = async () => {
    if (!currentUser) {
      alert('Please login to purchase');
      navigate('/login');
      return;
    }

    if (product.seller?._id === currentUser.id) {
      alert('You cannot buy your own product');
      return;
    }

    // Open payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    setIsProcessing(true);
    
    try {
      // Process payment with backend
      const response = await processPayment({
        ...paymentData,
        productId: product._id,
        quantity: quantity,
        totalAmount: product.price * quantity
      });

      if (response.success) {
        setShowPaymentModal(false);
        alert('Payment successful! Your order has been placed.');
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

  const handleAddToCart = () => {
    if (!currentUser) {
      alert('Please login to add to cart');
      navigate('/login');
      return;
    }

    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => item._id === product._id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add unique cartId for each item
      cart.push({ 
        ...product, 
        quantity,
        cartId: `${product._id}_${Date.now()}` // Unique identifier
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl transition-all"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Check if current user is the seller of this product
  const isOwnProduct = currentUser && product.seller && 
    (product.seller._id === currentUser._id || product.seller._id === currentUser.id || 
     product.seller === currentUser._id || product.seller === currentUser.id);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-100 py-6 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="relative h-[400px] lg:h-[500px] bg-black rounded-lg overflow-hidden">
              {allImages.length > 0 ? (
                <>
                  <img 
                    src={allImages[currentImageIndex]} 
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                  
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                        {currentImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="w-24 h-24 text-gray-600" />
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-primary-500 scale-105' 
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Details</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-600">Category</span>
                  <span className="text-gray-900">{product.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-600">Condition</span>
                  <span className="text-gray-900">{product.condition || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-600">Listed Date</span>
                  <span className="text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Video Section */}
            {product.videoUrl && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary-500" />
                  Product Video
                </h3>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <iframe
                    src={getVideoEmbedUrl(product.videoUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl font-bold text-gray-900">
                  {formatINR(product.price)}
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Heart className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {product.title}
              </h1>

              {/* Location and Date */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-6 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location || 'Location not specified'}</span>
                </div>
                <span>
                  {new Date(product.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: '2-digit'
                  })}
                </span>
              </div>

              {/* Seller Info */}
              {product.seller && (
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {product.seller.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Posted by {product.seller.name}</div>
                      <div className="text-sm text-gray-600">
                        Member since {new Date(product.seller.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  {/* <div className="text-center py-2 bg-gray-50 rounded text-sm text-gray-600">
                    <span className="font-bold text-gray-900">3</span> items listed
                  </div> */}
                </div>
              )}

              {/* Damage Condition */}
              {product.damageCondition && product.damageCondition.level !== 'None' && (
                <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-orange-900 text-sm mb-1">
                        Damage: {product.damageCondition.level}
                      </h3>
                      {product.damageCondition.description && (
                        <p className="text-xs text-orange-800">{product.damageCondition.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              {!isOwnProduct && (
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-gray-700 font-semibold text-sm">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-lg border-2 border-gray-300 hover:border-primary-500 font-bold text-lg transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-12 text-center text-xl font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-lg border-2 border-gray-300 hover:border-primary-500 font-bold text-lg transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {isOwnProduct ? (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border-2 border-blue-200 text-blue-700 px-6 py-4 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
                      <Package className="w-5 h-5" />
                      This is your product
                    </div>
                    <button
                      onClick={() => navigate(`/seller/products/edit/${product._id}`)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                      <Package className="w-5 h-5" />
                      Edit Product
                    </button>
                    <button
                      onClick={() => navigate('/seller/products')}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-primary-600 font-bold rounded-xl border-2 border-primary-500 hover:bg-primary-50 transition-all"
                    >
                      Back to My Products
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleBuyNow}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Buy Now
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleAddToCart}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-primary-600 font-bold rounded-lg border-2 border-primary-500 hover:bg-primary-50 transition-all"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>

                    <button
                      onClick={toggleWishlist}
                      className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 font-bold rounded-lg border-2 transition-all ${
                        isInWishlist 
                          ? 'bg-red-50 text-red-600 border-red-500 hover:bg-red-100' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-600' : ''}`} />
                      {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </button>

                    {product.seller && (
                      <button
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all"
                        onClick={() => {
                          // Navigate to chat or show message
                          alert('Chat with seller feature - Contact: ' + (product.seller.email || 'N/A'));
                        }}
                      >
                        <MessageCircle className="w-5 h-5" />
                        Chat with seller
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Posted in */}
              {product.location && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Posted in</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{product.location}</span>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <RotateCcw className="w-4 h-4 text-orange-500" />
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => !isProcessing && setShowPaymentModal(false)}
          product={product}
          quantity={quantity}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default ProductDetails;
