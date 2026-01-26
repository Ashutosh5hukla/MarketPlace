import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  ShieldCheck,
  Truck,
  Headphones
} from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer w-full">
      {/* Top Features Section */}
      <div className="footer-features w-full">
        <div className="container mx-auto px-4 max-w-full">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4>Free Shipping</h4>
                <p>On orders over ₹500</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4>Secure Payment</h4>
                <p>100% Protected</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4>24/7 Support</h4>
                <p>Dedicated assistance</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h4>Best Quality</h4>
                <p>Trusted products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main w-full">
        <div className="container mx-auto px-4 max-w-full">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-column">
              <div className="footer-logo">
                <ShoppingCart className="w-8 h-8" />
                <span className="footer-brand">ShopHub</span>
              </div>
              <p className="footer-description">
                Your trusted e-commerce destination for quality products and amazing deals. Shop smart, shop with confidence.
              </p>
              <div className="footer-social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/shop">Shop Now</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/faq">FAQs</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-column">
              <h3 className="footer-title">Categories</h3>
              <ul className="footer-links">
                <li><Link to="/shop?category=Books">📚 Books & Media</Link></li>
                <li><Link to="/shop?category=Electronics">💻 Electronics</Link></li>
                <li><Link to="/shop?category=Clothing">👕 Fashion</Link></li>
                <li><Link to="/shop?category=Furniture">🏠 Home & Living</Link></li>
                <li><Link to="/shop?category=Sports">⚽ Sports</Link></li>
                <li><Link to="/shop?category=Other">🎁 Other</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-column">
              <h3 className="footer-title">Get In Touch</h3>
              <ul className="footer-contact">
                <li>
                  <MapPin className="w-5 h-5" />
                  <span>123 Commerce Street<br />New Delhi, India 110001</span>
                </li>
                <li>
                  <Phone className="w-5 h-5" />
                  <span>+91 9876543210</span>
                </li>
                <li>
                  <Mail className="w-5 h-5" />
                  <span>support@shophub.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom w-full">
        <div className="container mx-auto px-4 max-w-full">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} ShopHub. All rights reserved.</p>
            <p className="footer-tagline">
              Made with <Heart className="w-4 h-4 inline-block text-red-500" fill="currentColor" /> for shoppers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
