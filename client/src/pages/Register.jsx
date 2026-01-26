import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import { User, Mail, Lock, Target, UserPlus, Loader2, AlertCircle, ShoppingBag, Briefcase } from 'lucide-react';

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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in-down">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 mb-2">Create Account</h2>
          <p className="text-gray-600">Join ShopHub today!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border-2 border-red-500 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Register
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-bold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
