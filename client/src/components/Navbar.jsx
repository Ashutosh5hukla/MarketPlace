import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { logout } from '../api';
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
  Package
} from 'lucide-react';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
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
    logout();
    setUser(null);
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
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/')}
          >
            <ShoppingCart className="w-7 h-7 text-primary-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
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
                <Link 
                  to="/shop" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 hover:text-primary-500 transition-all"
                >
                  <Store className="w-4 h-4" />
                  Shop
                </Link>
                <Link 
                  to="/rent" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 hover:text-primary-500 transition-all"
                >
                  <Tag className="w-4 h-4" />
                  Rent
                </Link>
                {(user.role === 'seller' || user.role === 'admin') && (
                  <Link 
                    to="/products/create" 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 hover:text-primary-500 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Sell
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-all"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Right Side - Cart & Profile */}
          {user && (
            <div className="hidden md:flex items-center gap-4">
              {/* Cart Icon */}
              <Link 
                to="/cart" 
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={toggleProfileDropdown}
                  aria-expanded={isProfileOpen}
                  aria-label="User menu"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
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
                      <Link 
                        to="/orders" 
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={closeDropdown}
                      >
                        <Package className="w-5 h-5" />
                        <span className="font-medium text-sm">My Orders</span>
                      </Link>
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
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in-down">
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
