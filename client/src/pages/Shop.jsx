import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProducts, getCurrentUser } from '../api';
import { formatINR } from '../utils/currency';
import { Search, ShoppingBag, Book, Laptop, Sofa, Shirt, Package, ChevronLeft, ChevronRight, Info, User, Loader2, Dumbbell } from 'lucide-react';

const categories = [
  { value: 'all', label: 'All Products', icon: ShoppingBag },
  { value: 'Books', label: 'Books', icon: Book },
  { value: 'Electronics', label: 'Electronics', icon: Laptop },
  { value: 'Furniture', label: 'Furniture', icon: Sofa },
  { value: 'Clothing', label: 'Clothing', icon: Shirt },
  { value: 'Sports', label: 'Sports & Fitness', icon: Dumbbell },
  { value: 'Other', label: 'Other', icon: Package }
];

const validCategories = new Set(categories.map((category) => category.value));

function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    // Check if user just signed up
    const newUserFlag = localStorage.getItem('isNewUser');
    if (newUserFlag === 'true') {
      setIsNewUser(true);
      // Clear the flag after reading it
      localStorage.removeItem('isNewUser');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, selectedCategory]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const nextCategory = categoryParam && validCategories.has(categoryParam)
      ? categoryParam
      : 'all';

    if (nextCategory !== selectedCategory) {
      setSelectedCategory(nextCategory);
      setPage(1);
    }
  }, [searchParams, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { page, search, limit: 12 };
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    if (category === 'all') {
      setSearchParams({});
      return;
    }
    setSearchParams({ category });
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : Package;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center max-w-md">
          <p className="text-red-600 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 overflow-x-hidden">
      <div className="container mx-auto max-w-7xl w-full px-4">
        {/* Shop Header */}
        <div className="text-center mb-10 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            {isNewUser ? 'Welcome' : 'Welcome back'}, {currentUser?.name || 'Shopper'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            {isNewUser 
              ? 'Start discovering amazing products tailored just for you' 
              : 'Discover amazing products tailored just for you'
            }
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-10 animate-fade-in-up">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.value}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                }`}
                onClick={() => handleCategoryChange(cat.value)}
              >
                <IconComponent className="w-5 h-5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md mx-auto animate-fade-in">
            <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
              {products.map((product) => {
                const CategoryIcon = getCategoryIcon(product.category);
                return (
                  <div 
                    key={product._id} 
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group"
                  >
                    <div className="relative h-56 bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center overflow-hidden">
                      {product.mainImage ? (
                        <img 
                          src={product.mainImage} 
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <CategoryIcon className="w-24 h-24 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
                      )}
                      {product.category && (
                        <span className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                          {product.category}
                        </span>
                      )}
                      {product.condition && (
                        <span className="absolute top-3 left-3 bg-white/90 text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold">
                          {product.condition}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      
                      <div className="text-2xl font-extrabold text-primary-600 flex items-center gap-1">
                        {formatINR(product.price)}
                      </div>
                      
                      {product.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      {product.seller && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <User className="w-4 h-4" />
                          <span>{product.seller.name}</span>
                        </div>
                      )}
                      
                      <button 
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <Info className="w-5 h-5" />
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12 animate-fade-in">
                <button 
                  className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                <span className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl shadow-lg">
                  Page {page} of {totalPages}
                </span>
                <button 
                  className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
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

export default Shop;
