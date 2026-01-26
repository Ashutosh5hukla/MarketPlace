import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import CreateProduct from "./pages/CreateProduct";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Rent from "./pages/Rent";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";

import { getCurrentUser } from "./api";


// ---------- Route Guards ----------
const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

const SellerRoute = ({ user, children }) => {
  return user && (user.role === "seller" || user.role === "admin")
    ? children
    : <Navigate to="/" />;
};

// Layout wrapper to conditionally show Navbar/Footer
function Layout({ user, setUser, children }) {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideNavAndFooter && <Navbar user={user} setUser={setUser} />}
      <div className="main-content w-full">
        {children}
      </div>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}


// ---------- App Component ----------
function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="App w-full min-h-screen overflow-x-hidden">

        <Layout user={user} setUser={setUser}>

          <Routes>

            <Route
              path="/"
              element={user ? <Navigate to="/shop" /> : <Home />}
            />

            <Route
              path="/login"
              element={user ? <Navigate to="/shop" /> : <Login setUser={setUser} />}
            />

            <Route
              path="/register"
              element={user ? <Navigate to="/shop" /> : <Register setUser={setUser} />}
            />

            <Route
              path="/shop"
              element={
                <ProtectedRoute user={user}>
                  <Shop />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute user={user}>
                  <ProductList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product/:id"
              element={
                <ProtectedRoute user={user}>
                  <ProductDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products/create"
              element={
                <SellerRoute user={user}>
                  <CreateProduct />
                </SellerRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute user={user}>
                  <MyOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute user={user}>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rent"
              element={
                <ProtectedRoute user={user}>
                  <Rent />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute user={user}>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route              path="/wishlist"
              element={
                <ProtectedRoute user={user}>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            <Route              path="/wishlist"
              element={
                <ProtectedRoute user={user}>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute user={user}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute user={user}>
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    <h2>Settings Page</h2>
                    <p>Settings page coming soon...</p>
                  </div>
                </ProtectedRoute>
              }
            />

          </Routes>

        </Layout>

      </div>
    </Router>
  );
}

export default App;
