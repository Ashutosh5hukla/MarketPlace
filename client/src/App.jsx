import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import CreateProduct from './pages/CreateProduct';
import MyOrders from './pages/MyOrders';
import Rent from './pages/Rent';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
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
          <div className={user ? "container" : ""}>
            <Routes>
              <Route path="/" element={user ? <Navigate to="/shop" /> : <Home />} />
              <Route path="/login" element={user ? <Navigate to="/shop" /> : <Login setUser={setUser} />} />
              <Route path="/register" element={user ? <Navigate to="/shop" /> : <Register setUser={setUser} />} />
              <Route 
                path="/shop" 
                element={
                  <ProtectedRoute>
                    <Shop />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/products" 
                element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/product/:id" 
                element={
                  <ProtectedRoute>
                    <ProductDetails />
                  </ProtectedRoute>
                } 
              />
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
              <Route 
                path="/rent" 
                element={
                  <ProtectedRoute>
                    <Rent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                      <h2>Settings Page</h2>
                      <p>Settings page coming soon...</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
