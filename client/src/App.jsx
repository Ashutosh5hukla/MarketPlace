import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, BuyerRoute, SellerRoute, PublicRoute } from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import SellerDashboard from "./pages/SellerDashboard";
import SellerProducts from "./pages/SellerProducts";
import SellerOrders from "./pages/SellerOrders";
import CreateProduct from "./pages/CreateProduct";
import Messages from "./pages/Messages";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// Layout wrapper
function Layout({ children }) {
  return (
    <div className="main-content w-full">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

// App Component
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
          <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/faq" element={<Layout><FAQ /></Layout>} />
              <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
              <Route path="/terms" element={<Layout><Terms /></Layout>} />
              
              {/* Auth Routes - redirect if already logged in */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              
              {/* Shop & Products - accessible to all authenticated users */}
              <Route path="/shop" element={<ProtectedRoute><Layout><Shop /></Layout></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute><Layout><ProductDetails /></Layout></ProtectedRoute>} />
              
              {/* Buyer Routes */}
              <Route path="/cart" element={<BuyerRoute><Layout><Cart /></Layout></BuyerRoute>} />
              <Route path="/wishlist" element={<BuyerRoute><Layout><Wishlist /></Layout></BuyerRoute>} />
              <Route path="/orders" element={<BuyerRoute><Layout><MyOrders /></Layout></BuyerRoute>} />
              <Route path="/order/:id" element={<BuyerRoute><Layout><OrderDetails /></Layout></BuyerRoute>} />
              
              {/* Seller Routes */}
              <Route path="/seller/dashboard" element={<SellerRoute><Layout><SellerDashboard /></Layout></SellerRoute>} />
              <Route path="/seller/products" element={<SellerRoute><Layout><SellerProducts /></Layout></SellerRoute>} />
              <Route path="/seller/products/create" element={<SellerRoute><Layout><CreateProduct /></Layout></SellerRoute>} />
              <Route path="/seller/orders" element={<SellerRoute><Layout><SellerOrders /></Layout></SellerRoute>} />
              <Route path="/seller/messages" element={<SellerRoute><Messages /></SellerRoute>} />
              
              {/* Shared Protected Routes */}
              <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
              
              {/* 404 - Redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AuthProvider>
    </Router>
  );
}

export default App;
