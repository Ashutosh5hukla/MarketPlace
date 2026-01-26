import { useState, useEffect } from 'react';
import { formatINR } from '../utils/currency';
import { ShoppingCart, CheckCircle2, Calendar, Clock, IndianRupee } from 'lucide-react';

// Dummy rental data
const rentalProducts = [
  {
    id: 1,
    name: 'Canon EOS R5 Camera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    pricePerDay: 50,
    pricePerWeek: 300,
    pricePerMonth: 1000,
    category: 'Electronics',
    description: 'Professional mirrorless camera for photography and videography'
  },
  {
    id: 2,
    name: 'Mountain Bike - Trek X-Caliber',
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop',
    pricePerDay: 25,
    pricePerWeek: 150,
    pricePerMonth: 500,
    category: 'Sports',
    description: 'High-performance mountain bike perfect for trails'
  },
  {
    id: 3,
    name: 'DJI Mavic Air 2 Drone',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop',
    pricePerDay: 40,
    pricePerWeek: 250,
    pricePerMonth: 850,
    category: 'Electronics',
    description: 'Professional drone with 4K camera and obstacle avoidance'
  },
  {
    id: 4,
    name: 'Gaming Laptop - ASUS ROG',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop',
    pricePerDay: 35,
    pricePerWeek: 220,
    pricePerMonth: 750,
    category: 'Electronics',
    description: 'High-end gaming laptop with RTX graphics'
  },
  {
    id: 5,
    name: 'GoPro Hero 11 Black',
    image: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=400&h=300&fit=crop',
    pricePerDay: 20,
    pricePerWeek: 120,
    pricePerMonth: 400,
    category: 'Electronics',
    description: 'Action camera with 5.3K video and HyperSmooth stabilization'
  },
  {
    id: 6,
    name: 'Electric Scooter - Xiaomi Pro',
    image: 'https://images.unsplash.com/photo-1559311694-ea14e3313f34?w=400&h=300&fit=crop',
    pricePerDay: 15,
    pricePerWeek: 90,
    pricePerMonth: 300,
    category: 'Transportation',
    description: 'Electric scooter with 45km range and foldable design'
  },
  {
    id: 7,
    name: 'Professional DJ Controller',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop',
    pricePerDay: 30,
    pricePerWeek: 180,
    pricePerMonth: 600,
    category: 'Audio',
    description: 'Pioneer DDJ-400 DJ controller for events and practice'
  },
  {
    id: 8,
    name: 'DSLR Photography Kit',
    image: 'https://images.unsplash.com/photo-1606244864456-8bee63fce472?w=400&h=300&fit=crop',
    pricePerDay: 45,
    pricePerWeek: 270,
    pricePerMonth: 900,
    category: 'Electronics',
    description: 'Complete photography kit with lenses and accessories'
  },
  {
    id: 9,
    name: 'Camping Tent - 4 Person',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop',
    pricePerDay: 12,
    pricePerWeek: 70,
    pricePerMonth: 250,
    category: 'Outdoor',
    description: 'Waterproof camping tent for family adventures'
  }
];

function Rent() {
  const [products] = useState(rentalProducts);
  const [selectedDurations, setSelectedDurations] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [notification, setNotification] = useState(null);

  // Set default durations and dates
  useEffect(() => {
    const initialDurations = {};
    const initialDates = {};
    products.forEach(product => {
      initialDurations[product.id] = 'day';
      initialDates[product.id] = new Date().toISOString().split('T')[0];
    });
    setSelectedDurations(initialDurations);
    setSelectedDates(initialDates);
  }, [products]);

  const handleDurationChange = (productId, duration) => {
    setSelectedDurations(prev => ({
      ...prev,
      [productId]: duration
    }));
  };

  const handleDateChange = (productId, date) => {
    setSelectedDates(prev => ({
      ...prev,
      [productId]: date
    }));
  };

  const getPriceForDuration = (product, duration) => {
    switch(duration) {
      case 'day':
        return product.pricePerDay;
      case 'week':
        return product.pricePerWeek;
      case 'month':
        return product.pricePerMonth;
      default:
        return product.pricePerDay;
    }
  };

  const addToCart = (product) => {
    const duration = selectedDurations[product.id];
    const startDate = selectedDates[product.id];
    const price = getPriceForDuration(product, duration);

    const cartItem = {
      ...product,
      rentalDuration: duration,
      rentalStartDate: startDate,
      rentalPrice: price,
      type: 'rental',
      cartId: `rental-${product.id}-${Date.now()}`
    };

    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(existingCart));

    // Dispatch event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));

    // Show notification
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const getDurationLabel = (duration) => {
    switch(duration) {
      case 'day': return '/ day';
      case 'week': return '/ week';
      case 'month': return '/ month';
      default: return '/ day';
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Rent Products
          </h1>
          <p className="text-gray-600 text-lg">Find quality products for short-term rentals</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 bg-white rounded-xl shadow-2xl border-l-4 border-green-500 p-4 flex items-center gap-3 z-50 animate-fade-in-down">
            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
            <span className="text-gray-800 font-medium">{notification}</span>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {products.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative h-56 overflow-hidden group">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm bg-opacity-90">
                  {product.category}
                </div>
              </div>

              {/* Product Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Price Display */}
                <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-4 mb-4 border border-primary-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-primary-600">
                      {formatINR(getPriceForDuration(product, selectedDurations[product.id] || 'day'))}
                    </span>
                    <span className="text-gray-600 font-medium">
                      {getDurationLabel(selectedDurations[product.id] || 'day')}
                    </span>
                  </div>
                </div>

                {/* Duration Selector */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 text-primary-500" />
                    Duration
                  </label>
                  <select 
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer hover:border-primary-300"
                    value={selectedDurations[product.id] || 'day'}
                    onChange={(e) => handleDurationChange(product.id, e.target.value)}
                  >
                    <option value="day">1 Day - {formatINR(product.pricePerDay)}</option>
                    <option value="week">1 Week - {formatINR(product.pricePerWeek)}</option>
                    <option value="month">1 Month - {formatINR(product.pricePerMonth)}</option>
                  </select>
                </div>

                {/* Date Picker */}
                <div className="mb-5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    Start Date
                  </label>
                  <input 
                    type="date"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer hover:border-primary-300"
                    value={selectedDates[product.id] || ''}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(product.id, e.target.value)}
                  />
                </div>

                {/* Add to Cart Button */}
                <button 
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Rent;
