import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, sendOrderMessage, getCurrentUser } from '../api';
import { formatINR } from '../utils/currency';
import { 
  Package, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  ShoppingBag, 
  ChevronLeft, 
  MessageCircle,
  Send,
  User,
  CreditCard,
  AlertCircle
} from 'lucide-react';

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    fetchOrder();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [order?.messages]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      const updatedOrder = await sendOrderMessage(id, message);
      setOrder(updatedOrder);
      setMessage('');
    } catch (err) {
      alert('Failed to send message: ' + (err.response?.data?.message || err.message));
    } finally {
      setSendingMessage(false);
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

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:shadow-xl transition-all"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const isChatEnabled = order.paymentStatus === 'completed';

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Orders
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 px-6 py-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{order._id.substring(0, 8).toUpperCase()}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(order.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border-2 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border-2 ${getPaymentStatusColor(order.paymentStatus)}`}>
                  <CreditCard className="w-5 h-5" />
                  <span className="capitalize">Payment: {order.paymentStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                <div className="text-2xl font-bold text-gray-900">{formatINR(order.totalAmount)}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Payment ID</div>
                <div className="text-sm font-mono text-gray-900">{order.paymentId || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Order ID</div>
                <div className="text-sm font-mono text-gray-900">{order.orderId || 'N/A'}</div>
              </div>
            </div>

            {/* Order Items */}
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary-500" />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    {item.product?.images && item.product.images.length > 0 ? (
                      <img 
                        src={typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0].url} 
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-primary-500" />
                      </div>
                    )}
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

        {/* Chat Section */}
        {isChatEnabled ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Order Chat
              </h2>
              <p className="text-white/80 text-sm mt-1">Communicate with the seller</p>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 bg-gray-50">
              {order.messages && order.messages.length > 0 ? (
                <div className="space-y-4">
                  {order.messages.map((msg, index) => {
                    const isOwnMessage = msg.sender?._id === currentUser?.id;
                    return (
                      <div 
                        key={index} 
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                          <div className={`rounded-2xl px-4 py-3 ${
                            isOwnMessage 
                              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' 
                              : 'bg-white border-2 border-gray-200 text-gray-900'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4" />
                              <span className="text-xs font-semibold">
                                {msg.sender?.name || 'User'}
                              </span>
                            </div>
                            <p className="text-sm break-words">{msg.message}</p>
                            <p className={`text-xs mt-2 ${isOwnMessage ? 'text-white/70' : 'text-gray-500'}`}>
                              {new Date(msg.timestamp).toLocaleString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || sendingMessage}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendingMessage ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Chat Not Available</h3>
            <p className="text-gray-600">
              Chat will be enabled once payment is completed successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
