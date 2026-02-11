import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShoppingCart, 
  User, 
  ChevronDown, 
  Menu, 
  X,
  Store,
  Tag,
  PlusCircle,
  Settings,
  LogOut,
  Package,
  LayoutDashboard,
  Heart
} from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout: authLogout, isBuyer, isSeller } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const dropdownRef = useRef(null);

  // Load cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItemCount(cart.length);
    };
    
    updateCartCount();
    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  // Load wishlist count from localStorage
  useEffect(() => {
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistItemCount(wishlist.length);
    };
    
    updateWishlistCount();
    // Listen for wishlist updates
    window.addEventListener('wishlistUpdated', updateWishlistCount);
    return () => window.removeEventListener('wishlistUpdated', updateWishlistCount);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authLogout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const closeDropdown = () => {
    setIsProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm w-full">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ShopHub
            </span>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {user ? (
              <>
                {isBuyer() ? (
                  <>
                    <Link 
                      to="/shop" 
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 transition-all duration-200"
                    >
                      <Store className="w-4 h-4" />
                      Shop
                    </Link>
                    <Link 
                      to="/rent" 
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 transition-all duration-200"
                    >
                      <Tag className="w-4 h-4" />
                      Rent
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/seller/dashboard" 
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 transition-all duration-200"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link 
                      to="/seller/products" 
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 transition-all duration-200"
                    >
                      <Package className="w-4 h-4" />
                      Products
                    </Link>
                    <Link 
                      to="/seller/orders" 
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 transition-all duration-200"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Orders
                    </Link>
                    <Link 
                      to="/seller/products/create" 
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 transition-all duration-200"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Product
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-5 py-2 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Right Side - Wishlist, Cart & Profile */}
          {user && (
            <div className="hidden md:flex items-center gap-4">
              {/* Wishlist Icon - Only for Buyers */}
              {isBuyer() && (
                <Link 
                  to="/wishlist" 
                  className="relative p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-200 group"
                  aria-label="Wishlist"
                >
                  <Heart className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors" />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      {wishlistItemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart Icon - Only for Buyers */}
              {isBuyer() && (
                <Link 
                  to="/cart" 
                  className="relative p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-200 group"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-primary-600 transition-colors" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-200"
                  onClick={toggleProfileDropdown}
                  aria-expanded={isProfileOpen}
                  aria-label="User menu"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white overflow-hidden">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-down">
                    <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className="text-xs opacity-90 mt-0.5">{user.email || 'user@example.com'}</div>
                    </div>
                    <div className="p-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={closeDropdown}
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium text-sm">My Profile</span>
                      </Link>
                      {isBuyer() ? (
                        <>
                          <Link 
                            to="/wishlist" 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={closeDropdown}
                          >
                            <Heart className="w-5 h-5" />
                            <span className="font-medium text-sm">My Wishlist</span>
                            {wishlistItemCount > 0 && (
                              <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                {wishlistItemCount}
                              </span>
                            )}
                          </Link>
                          <Link 
                            to="/orders" 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={closeDropdown}
                          >
                            <Package className="w-5 h-5" />
                            <span className="font-medium text-sm">My Orders</span>
                          </Link>
                        </>
                      ) : (
                        <Link 
                          to="/seller/dashboard" 
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={closeDropdown}
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          <span className="font-medium text-sm">Dashboard</span>
                        </Link>
                      )}
                      <Link 
                        to="/settings" 
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={closeDropdown}
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium text-sm">Settings</span>
                      </Link>
                      <div className="h-px bg-gray-200 my-2"></div>
                      <button 
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in-down w-full">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link 
                  to="/shop" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Store className="w-5 h-5" />
                  Shop
                </Link>
                <Link 
                  to="/rent" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Tag className="w-5 h-5" />
                  Rent
                </Link>
                {(user.role === 'seller' || user.role === 'admin') && (
                  <Link 
                    to="/products/create" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <PlusCircle className="w-5 h-5" />
                    Sell
                  </Link>
                )}
                <Link 
                  to="/wishlist" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                  Wishlist {wishlistItemCount > 0 && `(${wishlistItemCount})`}
                </Link>
                <Link 
                  to="/rent" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Tag className="w-5 h-5" />
                  Rent
                </Link>
                {(user.role === 'seller' || user.role === 'admin') && (
                  <Link 
                    to="/products/create" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <PlusCircle className="w-5 h-5" />
                    Sell
                  </Link>
                )}
                <Link 
                  to="/cart" 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Cart {cartItemCount > 0 && `(${cartItemCount})`}
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link 
                  to="/login" 
                  className="px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
