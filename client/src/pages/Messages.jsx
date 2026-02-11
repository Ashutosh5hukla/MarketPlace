import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, Send, User, Package, ArrowLeft } from 'lucide-react';
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
  const messagesEndRef = useRef(null);

  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Format time like WhatsApp
  const formatTime = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diff = now - messageDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

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
        setCurrentMessages(prev => {
          // Remove temporary messages
          const withoutTemp = prev.filter(msg => !String(msg._id).startsWith('temp-'));
          
          // Check if message already exists
          if (withoutTemp.some(msg => msg._id === payload._id)) {
            return prev;
          }
          
          // Add the new message
          return [...withoutTemp, payload];
        });
      }
      
      // Update the products with chats to show new message
      setProductsWithChats(prev => {
        return prev.map(product => {
          if (product._id === payload.product) {
            const updatedChats = product.chats.map(chat => {
              if (chat.buyerId === payload.buyer) {
                const senderIsYou = String(payload.sender) === String(user._id);
                return {
                  ...chat,
                  lastMessage: payload.message,
                  lastMessageTime: payload.createdAt,
                  lastSender: senderIsYou ? 'You' : 'Buyer'
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

    const messageText = messageInput.trim();
    
    // Optimistic UI update - add message immediately
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      message: messageText,
      sender: user._id,
      createdAt: new Date().toISOString(),
      product: selectedProduct._id,
      buyer: selectedBuyer,
      seller: selectedProduct.seller
    };
    
    setCurrentMessages(prev => [...prev, tempMessage]);
    setMessageInput('');

    // Send via socket
    socketRef.current?.emit('sendProductMessage', {
      productId: selectedProduct._id,
      buyerId: selectedBuyer,
      text: messageText
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111b21] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#00a884] border-t-transparent"></div>
          <p className="mt-4 text-gray-300">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#111b21] flex">
      {/* Sidebar */}
      <div className="w-full md:w-[400px] bg-[#111b21] border-r border-[#2a3942] flex flex-col">
        {/* Sidebar Header */}
        <div className="bg-[#202c33] px-4 py-3 flex items-center space-x-3">
          {user?.image ? (
            <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
          <span className="text-white font-medium">{user?.name}</span>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#374450] scrollbar-track-transparent">
          {productsWithChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center">
              <MessageCircle className="w-16 h-16 text-[#374450] mb-4" />
              <p className="text-[#aebac1] text-lg font-medium">No chats yet</p>
              <p className="text-[#667781] text-sm mt-2">When buyers message you, they'll appear here</p>
            </div>
          ) : (
            <div>
              {productsWithChats.map((product) => (
                <div key={product._id}>
                  {/* Product Header */}
                  <div className="bg-[#202c33] px-4 py-2 flex items-center space-x-2 sticky top-0 z-10">
                    <Package className="w-4 h-4 text-[#00a884]" />
                    <span className="text-[#aebac1] text-sm font-medium truncate">{product.name}</span>
                  </div>

                  {/* Buyers List */}
                  {product.chats.map((chat) => (
                    <div
                      key={`${product._id}-${chat.buyerId}`}
                      onClick={() => selectChat(product, chat.buyerId, chat.buyerName)}
                      className={`px-4 py-3 cursor-pointer hover:bg-[#202c33] transition-colors border-b border-[#2a3942] ${
                        selectedProduct?._id === product._id && selectedBuyer === chat.buyerId
                          ? 'bg-[#2a3942]'
                          : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        {chat.buyerImage ? (
                          <img
                            src={chat.buyerImage}
                            alt={chat.buyerName}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#374450] flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-[#aebac1]" />
                          </div>
                        )}

                        {/* Chat Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="text-white font-medium truncate">{chat.buyerName}</h3>
                            <span className="text-xs text-[#667781] flex-shrink-0 ml-2">
                              {formatTime(chat.lastMessageTime)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[#aebac1] text-sm truncate flex-1">
                              {chat.lastSender === 'You' && <span className="text-[#aebac1]">You: </span>}
                              {chat.lastMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0b141a] relative">
        {selectedProduct && selectedBuyer ? (
          <>
            {/* Chat Header */}
            <div className="bg-[#202c33] px-4 py-3 flex items-center space-x-3 border-b border-[#2a3942]">
              <button 
                className="md:hidden text-white mr-2"
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedBuyer(null);
                  setSelectedBuyerName('');
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              {/* Buyer Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#374450] flex items-center justify-center">
                <User className="w-6 h-6 text-[#aebac1]" />
              </div>
              <div>
                <h3 className="text-white font-medium">{selectedBuyerName}</h3>
                <p className="text-[#aebac1] text-xs">
                  {selectedProduct.name}
                </p>
              </div>
            </div>

            {/* Chat Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 md:px-16 py-4 space-y-2 scrollbar-thin scrollbar-thumb-[#374450] scrollbar-track-transparent relative z-10">
              {currentMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-[#374450] mx-auto mb-4" />
                    <p className="text-[#aebac1]">No messages yet</p>
                    <p className="text-[#667781] text-sm mt-2">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                <>
                  {currentMessages.map((message, index) => {
                    // Robust message sender comparison
                    const messageSenderId = typeof message.sender === 'object' 
                      ? (message.sender._id || message.sender.id)
                      : message.sender;
                    const isOwnMessage = String(messageSenderId) === String(user._id);
                    
                    const showDateDivider = index === 0 || 
                      new Date(currentMessages[index - 1].createdAt).toDateString() !== 
                      new Date(message.createdAt).toDateString();

                    return (
                      <React.Fragment key={message._id || index}>
                        {/* Date Divider */}
                        {showDateDivider && (
                          <div className="flex justify-center my-4">
                            <div className="bg-[#202c33] text-[#aebac1] text-xs px-3 py-1 rounded-md shadow-sm">
                              {new Date(message.createdAt).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric',
                                year: 'numeric' 
                              })}
                            </div>
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-1`}>
                          <div
                            className={`relative max-w-[65%] md:max-w-md px-3 py-2 rounded-lg shadow-md ${
                              isOwnMessage
                                ? 'bg-[#005c4b] text-white'
                                : 'bg-[#202c33] text-white'
                            }`}
                            style={{
                              borderRadius: isOwnMessage 
                                ? '8px 8px 0px 8px' 
                                : '8px 8px 8px 0px'
                            }}
                          >
                            {/* Message Text */}
                            <p className="text-sm leading-relaxed break-words pr-12">
                              {message.message}
                            </p>

                            {/* Time */}
                            <div className="absolute bottom-1 right-2">
                              <span className={`text-[10px] ${
                                isOwnMessage ? 'text-[#8696a0]' : 'text-[#667781]'
                              }`}>
                                {new Date(message.createdAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-[#202c33] px-4 py-3 flex items-center space-x-3 relative z-10">
              <div className="flex-1 bg-[#2a3942] rounded-lg flex items-center px-4 py-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message"
                  className="flex-1 bg-transparent text-white text-sm placeholder-[#aebac1] focus:outline-none"
                />
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className={`p-2 rounded-full transition-all ${
                  messageInput.trim()
                    ? 'bg-[#00a884] hover:bg-[#06cf9c] text-white'
                    : 'bg-[#374450] text-[#aebac1] cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          // No Chat Selected
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-8">
              <MessageCircle className="w-24 h-24 text-[#374450] mx-auto mb-6" />
              <h2 className="text-[#e9edef] text-2xl font-light mb-3">Messages</h2>
              <p className="text-[#8696a0] text-sm max-w-md mx-auto">
                Select a chat to start messaging with your buyers
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
