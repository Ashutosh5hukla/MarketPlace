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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #667eea 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-down">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-600">ShopHub - Your Shopping Destination</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                <span className="text-gray-900">Discover Amazing</span>
                <br />
                <span className="text-gray-900">Products,</span>
                <br />
                <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent">
                  Shop with Style
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Plan, browse, and shop from thousands of products using beautifully crafted marketplace built for modern shoppers — simple, powerful, and delightful.
              </p>
              
              {/* Hero Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                  onClick={() => navigate('/register')}
                >
                  <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Get Started for Free
                </button>
                <button 
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-primary-400 hover:shadow-lg transition-all"
                  onClick={() => navigate('/login')}
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">10K+</div>
                  </div>
                  <div className="text-gray-600 text-sm font-medium">Products</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">50K+</div>
                  </div>
                  <div className="text-gray-600 text-sm font-medium">Happy Customers</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-secondary-600 bg-clip-text text-transparent">99%</div>
                  </div>
                  <div className="text-gray-600 text-sm font-medium">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Image Gallery */}
            <div className="relative animate-fade-in-up">
              {/* Main Grid of Images */}
              <div className="grid grid-cols-2 gap-4">
                {/* Top Left - Large */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" 
                    alt="Headphones" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <span className="text-white font-semibold">Electronics</span>
                  </div>
                </div>

                {/* Top Right - Medium */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" 
                    alt="Watch" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <span className="text-white font-semibold">Accessories</span>
                  </div>
                </div>

                {/* Bottom Left - Medium */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80" 
                    alt="Sneakers" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <span className="text-white font-semibold">Fashion</span>
                  </div>
                </div>

                {/* Bottom Right - Large */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" 
                    alt="Books" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <span className="text-white font-semibold">Home & Living</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-full shadow-2xl animate-pulse">
                <div className="text-sm font-semibold">Free Shipping!</div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-primary-200 to-purple-200 rounded-full blur-3xl opacity-60 -z-10"></div>
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-to-br from-secondary-200 to-pink-200 rounded-full blur-3xl opacity-60 -z-10"></div>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-16 lg:mt-24">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100">
              <Truck className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Free Delivery</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100">
              <Lock className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100">
              <Gem className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Premium Quality</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100">
              <Gift className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Great Deals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="container mx-auto px-4 max-w-full">
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
      <section className="py-20 bg-white w-full">
        <div className="container mx-auto px-4 max-w-full">
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
      <section className="py-20 bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 relative overflow-hidden w-full">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10 max-w-full">
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
