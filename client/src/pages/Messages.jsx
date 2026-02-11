import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, Send, User, Package } from 'lucide-react';
import { getSellerChats, getProductChat } from '../api';
import { io } from 'socket.io-client';

const Messages = () => {
  const { user } = useAuth();
  const [productsWithChats, setProductsWithChats] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedBuyerName, setSelectedBuyerName] = useState('');
  const [currentMessages, setCurrentMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();

  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  // Initialize socket connection
  useEffect(() => {
    if (!user?._id) return;

    if (!socketRef.current) {
      socketRef.current = io(socketUrl, {
        auth: { token: localStorage.getItem('token') }
      });
    }

    const socket = socketRef.current;

    socket.on('productChatMessage', (payload) => {
      // Update current messages if this chat is selected
      if (selectedProduct?._id === payload.product && selectedBuyer === payload.buyer) {
        setCurrentMessages(prev => [...prev, payload]);
      }
      
      // Update the products with chats to show new message
      setProductsWithChats(prev => {
        return prev.map(product => {
          if (product._id === payload.product) {
            const updatedChats = product.chats.map(chat => {
              if (chat.buyerId === payload.buyer) {
                return {
                  ...chat,
                  lastMessage: payload.message,
                  lastMessageTime: payload.createdAt,
                  lastSender: payload.sender.name || (payload.sender === user._id ? 'You' : 'Buyer')
                };
              }
              return chat;
            });
            return { ...product, chats: updatedChats };
          }
          return product;
        });
      });
    });

    return () => {
      socket.off('productChatMessage');
    };
  }, [user?._id, selectedProduct?._id, selectedBuyer]);

  // Fetch seller's products with chats
  useEffect(() => {
    const fetchProductsWithChats = async () => {
      try {
        setLoading(true);
        const data = await getSellerChats();
        setProductsWithChats(data);
      } catch (error) {
        console.error('Error fetching seller chats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchProductsWithChats();
    }
  }, [user?._id]);

  // Fetch chat messages for a specific product and buyer
  const fetchChatMessages = async (productId, buyerId) => {
    try {
      const messages = await getProductChat(productId, buyerId);
      setCurrentMessages(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Join chat room and fetch messages
  const selectChat = (product, buyerId, buyerName) => {
    setSelectedProduct(product);
    setSelectedBuyer(buyerId);
    setSelectedBuyerName(buyerName);
    
    // Join socket room
    if (socketRef.current) {
      socketRef.current.emit('joinProductChat', {
        productId: product._id,
        buyerId: buyerId
      });
    }

    // Fetch messages
    fetchChatMessages(product._id, buyerId);
  };

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedProduct || !selectedBuyer) return;

    socketRef.current?.emit('sendProductMessage', {
      productId: selectedProduct._id,
      buyerId: selectedBuyer,
      text: messageInput.trim()
    });

    setMessageInput('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">Manage conversations with your buyers</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex h-[600px]">
            {/* Chat List Sidebar */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Your Products</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {productsWithChats.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">No messages yet</p>
                    <p className="text-sm">When buyers message you about your products, they'll appear here.</p>
                  </div>
                ) : (
                  productsWithChats.map((product) => (
                    <div key={product._id} className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Package className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900 truncate">{product.name}</span>
                      </div>
                      
                      {/* Buyers who have chatted about this product */}
                      <div className="ml-8 space-y-2">
                        {product.chats.map((chat) => (
                          <div
                            key={`${product._id}-${chat.buyerId}`}
                            onClick={() => selectChat(product, chat.buyerId, chat.buyerName)}
                            className={`p-2 rounded-lg cursor-pointer transition-colors ${
                              selectedProduct?._id === product._id && selectedBuyer === chat.buyerId
                                ? 'bg-indigo-50 border-indigo-200'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              {chat.buyerImage ? (
                                <img 
                                  src={chat.buyerImage} 
                                  alt={chat.buyerName}
                                  className="w-4 h-4 rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-4 h-4 text-gray-400" />
                              )}
                              <span className="text-sm font-medium text-gray-900">{chat.buyerName}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 truncate">{chat.lastMessage}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {chat.lastSender} • {new Date(chat.lastMessageTime).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedProduct && selectedBuyer ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedProduct.name}</h3>
                      <p className="text-sm text-gray-600">Chat with {selectedBuyerName}</p>
                    </div>
                    <MessageCircle className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentMessages.map((message, index) => (
                      <div
                        key={message._id || index}
                        className={`flex ${message.sender === user._id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === user._id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === user._id ? 'text-indigo-200' : 'text-gray-500'
                          }`}>
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">Select a conversation</p>
                    <p className="text-sm">Choose a product and buyer to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;