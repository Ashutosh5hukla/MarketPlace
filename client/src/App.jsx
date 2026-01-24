import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import CreateProduct from './pages/CreateProduct';
import MyOrders from './pages/MyOrders';
import { getCurrentUser } from './api';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  const SellerRoute = ({ children }) => {
    return user && (user.role === 'seller' || user.role === 'admin') 
      ? children 
      : <Navigate to="/" />;
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} setUser={setUser} />
        <div className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />
              <Route path="/products" element={<ProductList />} />
              <Route 
                path="/products/create" 
                element={
                  <SellerRoute>
                    <CreateProduct />
                  </SellerRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
