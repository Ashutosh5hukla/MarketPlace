import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <h1 onClick={() => navigate('/')}>🛒 Student Marketplace</h1>
        <div>
          <Link to="/products">Products</Link>
          {user ? (
            <>
              {(user.role === 'seller' || user.role === 'admin') && (
                <Link to="/products/create">Sell Product</Link>
              )}
              <Link to="/orders">My Orders</Link>
              <span style={{ color: '#fff', marginLeft: '1rem' }}>
                Welcome, {user.name}
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
