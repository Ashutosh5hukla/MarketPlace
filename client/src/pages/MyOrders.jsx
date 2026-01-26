import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../api';
import { formatINR } from '../utils/currency';
import { Package, Calendar, Clock, CheckCircle, XCircle, Loader2, ShoppingBag } from 'lucide-react';

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-md">
          <p className="text-red-600 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent mb-3">
            My Orders
          </h1>
          <p className="text-gray-600 text-lg">Track and manage your purchases</p>
        </div>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center">
            <Package className="w-12 h-12 text-primary-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
          <button 
            className="px-8 py-3.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
            onClick={() => window.location.href = '/shop'}
          >
            <ShoppingBag className="w-5 h-5 inline mr-2" />
            Browse Shop
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in-up">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-primary-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Order #{order._id.substring(0, 8).toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                      <div className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        {formatINR(order.totalAmount)}
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary-500" />
                  Order Items
                </h4>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-primary-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {item.product?.title || 'Product'}
                          </div>
                          <div className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-gray-900">
                          {formatINR((item.product?.price || 0) * item.quantity)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatINR(item.product?.price || 0)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default MyOrders;
