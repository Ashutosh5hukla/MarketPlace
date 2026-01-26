import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getCurrentUser, createOrder } from '../api';
import { formatINR } from '../utils/currency';
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
  CreditCard
} from 'lucide-react';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    fetchProduct();
  }, [id]);

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

    setIsProcessing(true);
    
    try {
      // Create order directly with items array format
      const orderData = {
        items: [
          {
            product: product._id,
            quantity: quantity
          }
        ]
      };

      await createOrder(orderData);
      
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert('Error placing order: ' + (error.response?.data?.message || error.message));
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
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
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

  const isOwnProduct = currentUser && product.seller?._id === currentUser.id;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-96 lg:h-[500px] bg-gray-100 rounded-xl overflow-hidden group">
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
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="w-24 h-24 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-primary-500 scale-105' 
                          : 'border-gray-200 hover:border-primary-300'
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

              {/* Video Section */}
              {product.videoUrl && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
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

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Category Badge */}
              {product.category && (
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full text-sm font-semibold">
                  {product.category}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>

              {/* Rating (Mock) */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">(4.5/5) 120 reviews</span>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6 border-2 border-primary-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold text-primary-600">
                    {formatINR(product.price)}
                  </span>
                  <span className="text-gray-500 line-through text-xl">
                    {formatINR(product.price * 1.3)}
                  </span>
                  <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">
                    23% OFF
                  </span>
                </div>
                <p className="text-gray-600 mt-2">Inclusive of all taxes</p>
              </div>

              {/* Condition & Damage */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Package className="w-5 h-5 text-primary-500" />
                    <span className="font-medium">Condition</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{product.condition || 'Good'}</p>
                </div>

                {product.seller && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <User className="w-5 h-5 text-primary-500" />
                      <span className="font-medium">Seller</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{product.seller.name}</p>
                  </div>
                )}
              </div>

              {/* Damage Condition */}
              {product.damageCondition && product.damageCondition.level !== 'None' && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-bold text-orange-900 mb-1">
                        Damage: {product.damageCondition.level}
                      </h3>
                      {product.damageCondition.description && (
                        <p className="text-orange-800">{product.damageCondition.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-semibold">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-primary-500 font-bold text-lg transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-xl font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-primary-500 font-bold text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isOwnProduct ? (
                  <div className="bg-gray-100 text-gray-500 px-6 py-4 rounded-xl text-center font-bold">
                    This is your product
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleBuyNow}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-primary-600 font-bold rounded-xl border-2 border-primary-500 hover:bg-primary-50 transition-all"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RotateCcw className="w-5 h-5 text-orange-500" />
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-purple-500" />
                  <span>Verified Seller</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="border-t border-gray-200 p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Category:</span>
                <span className="text-gray-900">{product.category || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Condition:</span>
                <span className="text-gray-900">{product.condition || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Listed Date:</span>
                <span className="text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Product ID:</span>
                <span className="text-gray-900 font-mono text-sm">{product._id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
