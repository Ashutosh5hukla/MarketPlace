import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Simple test component
function TestHome() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>MarketPlace is Working!</h1>
      <p>The app is loading successfully.</p>
      <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Go to Login</a>
    </div>
  );
}

function TestLogin() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Login Page</h1>
      <p>This is the login page.</p>
      <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>Back to Home</a>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<TestHome />} />
            <Route path="/login" element={<TestLogin />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;