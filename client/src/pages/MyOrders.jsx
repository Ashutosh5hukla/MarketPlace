import { useState, useEffect } from 'react';
import { getMyOrders } from '../api';

function MyOrders() {
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

  if (loading) {
    return <div className="loading">Loading your orders ..</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: '#2c3e50' }}>My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="loading">No orders yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order._id} style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
                    Order #{order._id.substring(0, 8)}
                  </h3>
                  <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: '#27ae60' 
                  }}>
                    ${order.totalAmount.toFixed(2)}
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    backgroundColor: order.status === 'completed' ? '#d4edda' : 
                                   order.status === 'cancelled' ? '#f8d7da' : '#fff3cd',
                    color: order.status === 'completed' ? '#155724' : 
                           order.status === 'cancelled' ? '#721c24' : '#856404'
                  }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid #ecf0f1', paddingTop: '1rem' }}>
                <h4 style={{ color: '#555', marginBottom: '0.75rem' }}>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} style={{ 
                    padding: '0.5rem 0', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    color: '#7f8c8d'
                  }}>
                    <span>
                      {item.product?.title || 'Product'} × {item.quantity}
                    </span>
                    <span>
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
