import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, BuyerRoute, SellerRoute, PublicRoute } from "./components/ProtectedRoutes";

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

// Seller Pages
import SellerDashboard from "./pages/SellerDashboard";
import SellerProducts from "./pages/SellerProducts";
import SellerOrders from "./pages/SellerOrders";



// Layout wrapper to conditionally show Navbar/Footer
function Layout({ children }) {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <div className="main-content w-full">
        {children}
      </div>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}


// ---------- App Component ----------
function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <div className="App w-full min-h-screen overflow-x-hidden">
          <Layout>
            <Routes>

              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Home />
                  </PublicRoute>
                }
              />

              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Buyer-Only Routes */}
              <Route
                path="/shop"
                element={
                  <BuyerRoute>
                    <Shop />
                  </BuyerRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <BuyerRoute>
                    <Cart />
                  </BuyerRoute>
                }
              />

              <Route
                path="/rent"
                element={
                  <BuyerRoute>
                    <Rent />
                  </BuyerRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <BuyerRoute>
                    <MyOrders />
                  </BuyerRoute>
                }
              />

              {/* Seller-Only Routes */}
              <Route
                path="/seller/dashboard"
                element={
                  <SellerRoute>
                    <SellerDashboard />
                  </SellerRoute>
                }
              />

              <Route
                path="/seller/products"
                element={
                  <SellerRoute>
                    <SellerProducts />
                  </SellerRoute>
                }
              />

              <Route
                path="/seller/products/create"
                element={
                  <SellerRoute>
                    <CreateProduct />
                  </SellerRoute>
                }
              />

              <Route
                path="/seller/products/edit/:id"
                element={
                  <SellerRoute>
                    <CreateProduct />
                  </SellerRoute>
                }
              />

              <Route
                path="/seller/orders"
                element={
                  <SellerRoute>
                    <SellerOrders />
                  </SellerRoute>
                }
              />

              {/* Shared Protected Routes (Both Buyers & Sellers) */}
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
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
      </AuthProvider>
    </Router>
  );
}

export default App;
