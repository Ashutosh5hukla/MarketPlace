import { useState, useEffect } from 'react';
import { getProducts, getCurrentUser } from '../api';
import ProductDetailsModal from '../components/ProductDetailsModal';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ page, search, limit: 12 });
      setProducts(data.products);
      setTotalPages(data.pages);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <div className="products-header">
        <h2>✨ All Products</h2>
        <input
          type="text"
          placeholder="🔍 Search products..."
          className="search-bar"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {products.length === 0 ? (
        <div className="loading">No products found 🔍</div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                {product.category && (
                  <span className="category">{product.category}</span>
                )}
                <h3>{product.title}</h3>
                <div className="price">${product.price.toFixed(2)}</div>
                {product.description && (
                  <p className="description">
                    {product.description.substring(0, 100)}
                    {product.description.length > 100 && '...'}
                  </p>
                )}
                {product.seller && (
                  <p className="seller">👤 Seller: {product.seller.name}</p>
                )}
                
                {/* Info Button */}
                <button 
                  className="btn-info"
                  onClick={() => setSelectedProduct(product)}
                  title="View product details"
                >
                  ℹ️ View Details
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Previous
              </button>
              <span style={{ 
                padding: '0.5rem 1rem',
                color: 'white',
                fontWeight: '600',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}>
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct}
          currentUser={currentUser}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default ProductList;
