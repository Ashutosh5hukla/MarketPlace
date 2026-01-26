import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import { User, Mail, Lock, Target, UserPlus, Loader2, AlertCircle, ShoppingBag, Briefcase, ArrowLeft, Home } from 'lucide-react';

function Register({ setUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await register(formData);
      setUser(userData);
      // Mark user as newly registered
      localStorage.setItem('isNewUser', 'true');
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #667eea 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>
      
      {/* Back to Home Button */}
      <Link 
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-xl hover:bg-white hover:shadow-lg transition-all z-50"
      >
        <ArrowLeft className="w-5 h-5" />
        <Home className="w-5 h-5" />
      </Link>
      
      <div className="relative grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full animate-fade-in-down">
        {/* Left Side - Form */}
        <div className="p-8 lg:p-10 order-2 lg:order-1">
          <div className="text-center mb-6">
            <div className="lg:hidden inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-3">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 mb-2">Join ShopHub</h2>
            <p className="text-gray-600">Create your account and start shopping</p>
          </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border-2 border-red-500 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <User className="w-5 h-5 text-primary-500" />
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <Mail className="w-5 h-5 text-primary-500" />
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <Lock className="w-5 h-5 text-primary-500" />
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Role Field */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <Target className="w-5 h-5 text-primary-500" />
              I want to:
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors bg-white cursor-pointer"
            >
              <option value="buyer">🛍️ Buy products</option>
              <option value="seller">💼 Sell products</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 text-white font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Create My Account
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 pt-4 border-t-2 border-gray-100 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
        </div>

        {/* Right Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-secondary-600 via-pink-600 to-primary-600 p-8 text-white relative overflow-hidden order-1 lg:order-2">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          </div>
          <div className="relative z-10 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-2">
              <UserPlus className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-extrabold leading-tight">Start Your Shopping Journey</h2>
            <p className="text-lg text-white/90 leading-relaxed">Join thousands of happy shoppers. Discover amazing products, great deals, and seamless shopping experience.</p>
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <ShoppingBag className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold">Wide Selection</div>
                  <div className="text-xs text-white/80">10,000+ products to choose from</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <Lock className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold">Secure Shopping</div>
                  <div className="text-xs text-white/80">Your data is safe with us</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <Target className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold">Fast Delivery</div>
                  <div className="text-xs text-white/80">Quick and reliable shipping</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
