import { useState } from 'react';
import { createOrder } from '../api';
import { formatINR } from '../utils/currency';
import { X, ShoppingCart, Package, User, Calendar, CheckCircle2, AlertCircle, Loader2, IndianRupee, Video, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

function ProductDetailsModal({ product, onClose, currentUser }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all images
  const allImages = product.images && product.images.length > 0 
    ? product.images.map(img => typeof img === 'string' ? img : img.url)
    : product.mainImage 
      ? [product.mainImage]
      : [];

  // Check if current user is the seller
  const isOwnProduct = currentUser && product.seller?._id === currentUser.id;

  const handleBuyNow = async () => {
    if (!currentUser) {
      setError('Please login to purchase products');
      return;
    }

    if (isOwnProduct) {
      setError('You cannot buy your own product');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createOrder({
        productId: product._id,
        quantity: 1
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const getVideoEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    
    return url;
  };

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-down"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            onClick={onClose} 
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>

          {/* Product Details */}
          <div className="p-8">
            {/* Image Gallery */}
            {allImages.length > 0 && (
              <div className="mb-6">
                <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden group">
                  <img 
                    src={allImages[currentImageIndex]} 
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                  
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {allImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex 
                                ? 'bg-white w-8' 
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Thumbnail Strip */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
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
              </div>
            )}

            {/* Video Section */}
            {product.videoUrl && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary-500" />
                  Product Video
                </h3>
                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                  <iframe
                    src={getVideoEmbedUrl(product.videoUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Header Section */}
            <div className="mb-6">
              {product.category && (
                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full text-sm font-semibold mb-3">
                  {product.category}
                </span>
              )}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h2>
              <div className="text-4xl font-extrabold text-primary-600 flex items-center gap-2">
                {formatINR(product.price)}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-4 mb-6 bg-gray-50 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-600 font-medium">Condition:</span>
                <span className="text-gray-900 font-semibold">{product.condition || 'Good'}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-600 font-medium">Seller:</span>
                <span className="text-gray-900 font-semibold">{product.seller?.name || 'Unknown'}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-600 font-medium">Listed:</span>
                <span className="text-gray-900 font-semibold">{formatDate(product.createdAt)}</span>
              </div>
            </div>

            {/* Damage Condition Section */}
            {product.damageCondition && product.damageCondition.level !== 'None' && (
              <div className="mb-6 bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-orange-900 mb-2">
                      Damage Condition: {product.damageCondition.level}
                    </h3>
                    {product.damageCondition.description && (
                      <p className="text-orange-800 leading-relaxed">
                        {product.damageCondition.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description || 'No description provided.'}</p>
            </div>

            {/* Status Messages */}
            {success && (
              <div className="mb-6 flex items-center gap-3 bg-green-50 border-2 border-green-500 rounded-xl p-4">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-green-700 font-semibold">Order placed successfully! Redirecting...</span>
              </div>
            )}
            {error && (
              <div className="mb-6 flex items-center gap-3 bg-red-50 border-2 border-red-500 rounded-xl p-4">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <span className="text-red-700 font-semibold">{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {isOwnProduct ? (
                <button 
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-500 font-bold rounded-xl cursor-not-allowed"
                  disabled
                >
                  <Package className="w-5 h-5" />
                  Your Product
                </button>
              ) : (
                <>
                  <button 
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleBuyNow}
                    disabled={loading || success || !currentUser}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : success ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Ordered!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Buy Now
                      </>
                    )}
                  </button>
                  <button 
                    className="flex-1 px-6 py-4 bg-white text-primary-600 font-bold rounded-xl border-2 border-primary-500 hover:bg-primary-50 transition-all"
                    onClick={onClose}
                  >
                    Continue Browsing
                  </button>
                </>
              )}
            </div>

            {!currentUser && !isOwnProduct && (
              <p className="text-center text-gray-600 mt-4">
                💡 Please <a href="/login" className="text-primary-600 font-semibold hover:underline">login</a> to purchase products
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailsModal;
