import { useState, useEffect } from 'react';
import { getProducts } from '../api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

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
        <h2>All Products</h2>
        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {products.length === 0 ? (
        <div className="loading">No products found</div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <h3>{product.title}</h3>
                {product.category && (
                  <span className="category">{product.category}</span>
                )}
                <div className="price">${product.price.toFixed(2)}</div>
                {product.description && (
                  <p className="description">
                    {product.description.substring(0, 100)}
                    {product.description.length > 100 && '...'}
                  </p>
                )}
                {product.seller && (
                  <p className="seller">Seller: {product.seller.name}</p>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span style={{ padding: '0.5rem 1rem' }}>
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductList;
