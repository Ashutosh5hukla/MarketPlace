import { useNavigate } from 'react-router-dom';
import { 
  Rocket, LogIn, Package, Users, TrendingUp, 
  Truck, Lock, Gem, Gift, 
  Book, Laptop, Shirt, Home as HomeIcon, Dumbbell, Palette,
  Sparkles
} from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[90vh]">
          <div className="text-center max-w-4xl animate-fade-in-down">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Discover Amazing Products
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
                At Unbeatable Prices
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
              Your one-stop destination for quality products, fast shipping, and incredible deals.
              Shop with confidence and style!
            </p>
            
            {/* Hero Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                onClick={() => navigate('/register')}
              >
                <Rocket className="w-5 h-5" />
                Start Shopping Now
              </button>
              <button 
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all"
                onClick={() => navigate('/login')}
              >
                <LogIn className="w-5 h-5" />
                Already a member? Login
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-fade-in-up">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="w-6 h-6 text-yellow-300" />
                  <div className="text-4xl font-extrabold text-white">10K+</div>
                </div>
                <div className="text-white/80 font-medium">Products</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-6 h-6 text-green-300" />
                  <div className="text-4xl font-extrabold text-white">50K+</div>
                </div>
                <div className="text-white/80 font-medium">Happy Customers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-6 h-6 text-pink-300" />
                  <div className="text-4xl font-extrabold text-white">99%</div>
                </div>
                <div className="text-white/80 font-medium">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Decorative Cards */}
        <div className="absolute top-20 left-10 hidden lg:block animate-float">
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 flex items-center gap-3">
            <Laptop className="w-8 h-8 text-white" />
            <span className="text-white font-semibold">Electronics</span>
          </div>
        </div>
        <div className="absolute top-40 right-20 hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 flex items-center gap-3">
            <Shirt className="w-8 h-8 text-white" />
            <span className="text-white font-semibold">Fashion</span>
          </div>
        </div>
        <div className="absolute bottom-40 left-20 hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 flex items-center gap-3">
            <HomeIcon className="w-8 h-8 text-white" />
            <span className="text-white font-semibold">Home & Living</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
            Why Shop With Us?
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Experience the best online shopping with our premium features</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
              <p className="text-gray-600">Get your orders delivered quickly with our express shipping options</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payment</h3>
              <p className="text-gray-600">Shop with confidence using our secure payment gateway</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gem className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-600">All products are verified for quality and authenticity</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Great Deals</h3>
              <p className="text-gray-600">Enjoy exclusive discounts and special offers daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
            Shop by Category
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Explore our wide range of product categories</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
              onClick={() => navigate('/register')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform"></div>
              <Book className="w-12 h-12 text-blue-600 mb-4 relative z-10" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Books & Media</h3>
              <p className="text-gray-600 relative z-10">Bestsellers, eBooks, and more</p>
            </div>
            
            <div 
              className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
              onClick={() => navigate('/register')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform"></div>
              <Laptop className="w-12 h-12 text-purple-600 mb-4 relative z-10" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Electronics</h3>
              <p className="text-gray-600 relative z-10">Latest gadgets and tech</p>
            </div>
            
            <div 
              className="group relative bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
              onClick={() => navigate('/register')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform"></div>
              <Shirt className="w-12 h-12 text-pink-600 mb-4 relative z-10" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Fashion</h3>
              <p className="text-gray-600 relative z-10">Trending styles for everyone</p>
            </div>
            
            <div 
              className="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
              onClick={() => navigate('/register')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform"></div>
              <HomeIcon className="w-12 h-12 text-green-600 mb-4 relative z-10" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Home & Living</h3>
              <p className="text-gray-600 relative z-10">Beautiful home essentials</p>
            </div>
            
            <div 
              className="group relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
              onClick={() => navigate('/register')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform"></div>
              <Dumbbell className="w-12 h-12 text-orange-600 mb-4 relative z-10" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Sports & Fitness</h3>
              <p className="text-gray-600 relative z-10">Stay active and healthy</p>
            </div>
            
            <div 
              className="group relative bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
              onClick={() => navigate('/register')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform"></div>
              <Palette className="w-12 h-12 text-indigo-600 mb-4 relative z-10" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">Arts & Crafts</h3>
              <p className="text-gray-600 relative z-10">Creative supplies and tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Shopping?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of happy customers and discover amazing deals today!
          </p>
          <button 
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-primary-600 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all text-lg"
            onClick={() => navigate('/register')}
          >
            <Sparkles className="w-6 h-6" />
            Create Your Account - It's Free!
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
