import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, getCurrentUser } from '../api';
import { formatINR } from '../utils/currency';
import { 
  Search, Package, User, IndianRupee, Info, 
  ChevronLeft, ChevronRight, Loader2, AlertCircle,
  Sparkles, Filter, Grid, List
} from 'lucide-react';

function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, currentUser]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Add sellerId filter to show only current user's products
      const params = { 
        page, 
        search, 
        limit: 12
      };
      
      // If current user is a seller, filter by their ID
      if (currentUser && (currentUser.role === 'seller' || currentUser.role === 'admin')) {
        params.sellerId = currentUser._id;
      }
      
      const data = await getProducts(params);
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

  const getCategoryIcon = (category) => {
    const icons = {
      'Books': '📚',
      'Electronics': '💻',
      'Furniture': '🛋️',
      'Clothing': '👕',
      'Sports': '⚽',
      'Home': '🏠',
      'Other': '📦'
    };
    return icons[category] || '📦';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="flex items-center gap-3 text-red-500 mb-4">
            <AlertCircle className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Error</h2>
          </div>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-primary-500" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
              {currentUser && (currentUser.role === 'seller' || currentUser.role === 'admin') 
                ? 'My Products' 
                : 'All Products'}
            </h1>
          </div>
          
          {currentUser && (currentUser.role === 'seller' || currentUser.role === 'admin') && (
            <p className="text-gray-600 mb-4">
              Manage your product listings and track your inventory
            </p>
          )}

          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, category, or description..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all bg-white"
                value={search}
                onChange={handleSearch}
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-white border-2 border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              {search ? `No products match "${search}"` : 'No products available yet'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Products Grid/List */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {products.map((product) => (
                <div
                  key={product._id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all group ${
                    viewMode === 'grid' 
                      ? 'p-6 hover:-translate-y-1' 
                      : 'p-6 flex gap-6'
                  }`}
                >
                  {/* Product Image */}
                  {viewMode === 'grid' ? (
                    <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                      {product.mainImage ? (
                        <img 
                          src={product.mainImage} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-16 h-16 text-primary-400" />
                      )}
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {product.mainImage ? (
                        <img 
                          src={product.mainImage} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-12 h-12 text-primary-400" />
                      )}
                    </div>
                  )}

                  {/* Product Content */}
                  <div className="flex-1">
                    {/* Category Badge */}
                    {product.category && (
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full text-xs font-semibold mb-3">
                        {getCategoryIcon(product.category)} {product.category}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-extrabold text-green-600">
                        {formatINR(product.price)}
                      </span>
                    </div>

                    {/* Description */}
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Seller Info */}
                    {product.seller && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <User className="w-4 h-4" />
                        <span>Seller: {product.seller.name}</span>
                      </div>
                    )}

                    {/* View Details Button */}
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                      <Info className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-primary-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold shadow-lg">
                  Page {page} of {totalPages}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-primary-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 transition-all"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductList;
