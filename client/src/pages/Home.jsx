import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
      <h1 style={{ fontSize: '3rem', color: '#2c3e50', marginBottom: '1rem' }}>
        Welcome to Student Marketplace 🎓
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '2rem' }}>
        Buy and sell textbooks, electronics, furniture, and more!
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button 
          className="btn" 
          style={{ width: 'auto', padding: '1rem 2rem' }}
          onClick={() => navigate('/products')}
        >
          Browse Products
        </button>
        <button 
          className="btn" 
          style={{ width: 'auto', padding: '1rem 2rem', backgroundColor: '#27ae60' }}
          onClick={() => navigate('/register')}
        >
          Get Started
        </button>
      </div>
      
      <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#3498db', marginBottom: '1rem' }}>📚 Books & Textbooks</h3>
          <p style={{ color: '#7f8c8d' }}>Save money on expensive textbooks</p>
        </div>
        <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#e74c3c', marginBottom: '1rem' }}>💻 Electronics</h3>
          <p style={{ color: '#7f8c8d' }}>Find laptops, tablets, and more</p>
        </div>
        <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#27ae60', marginBottom: '1rem' }}>🛋️ Furniture</h3>
          <p style={{ color: '#7f8c8d' }}>Furnish your dorm room affordably</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
