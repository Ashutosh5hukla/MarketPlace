import { useState } from 'react';
import { createOrder } from '../api';

function ProductDetailsModal({ product, onClose, currentUser }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <>
      {/* Modal Overlay */}
      <div className="modal-overlay" onClick={onClose}>
        {/* Modal Content */}
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>

          {/* Product Details */}
          <div className="modal-body">
            {/* Header Section */}
            <div className="modal-header">
              {product.category && (
                <span className="product-category-badge">{product.category}</span>
              )}
              <h2 className="modal-title">{product.title}</h2>
              <div className="modal-price">${product.price.toFixed(2)}</div>
            </div>

            {/* Details Section */}
            <div className="modal-details">
              <div className="detail-row">
                <span className="detail-label">📦 Condition:</span>
                <span className="detail-value">{product.condition || 'Good'}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">👤 Seller:</span>
                <span className="detail-value">{product.seller?.name || 'Unknown'}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">📅 Listed:</span>
                <span className="detail-value">{formatDate(product.createdAt)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="modal-description">
              <h3>Description</h3>
              <p>{product.description || 'No description provided.'}</p>
            </div>

            {/* Status Messages */}
            {success && (
              <div className="success-message">
                ✅ Order placed successfully! Redirecting...
              </div>
            )}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="modal-actions">
              {isOwnProduct ? (
                <button className="btn-secondary" disabled>
                  🏷️ Your Product
                </button>
              ) : (
                <>
                  <button 
                    className="btn-primary"
                    onClick={handleBuyNow}
                    disabled={loading || success || !currentUser}
                  >
                    {loading ? '⏳ Processing...' : success ? '✅ Ordered!' : '🛒 Buy Now'}
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={onClose}
                  >
                    Continue Browsing
                  </button>
                </>
              )}
            </div>

            {!currentUser && !isOwnProduct && (
              <p className="login-hint">
                💡 Please <a href="/login">login</a> to purchase products
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailsModal;
