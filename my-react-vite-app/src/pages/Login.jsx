import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logIn } from '../services/login.service';
import LandingHeader from '../components/LandingHeader';
import '../styles/Auth.css';

const Login = () => {

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      console.log('🔐 Attempting login with:', formData.email);
      const response = await logIn({ email: formData.email, password: formData.password });
      if (!response || !response.user || !response.token) {
        console.error('❌ Login returned invalid response:', response);
        setError('Login failed. Invalid response from server.');
        setLoading(false);
        return;
      }
      const { user, token } = response;
      
      if (!user || !user.role) {
        console.error('❌ Login returned invalid user data:', user);
        setError('Login failed. Invalid user data returned from server.');
        setLoading(false);
        return;
      }
      
      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      console.log('✅ Login successful, user:', user);
      console.log('👤 User role:', user.role);
      console.log('🚀 Redirecting to:', user.role === 'admin' ? '/admin/dashboard' : user.role === 'advisor' ? '/advisor/dashboard' : '/student/dashboard');
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate('/redirect', { replace: true });
      }, 100);
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMessage =
        err.message ||
        'Login failed. Please check your credentials.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <LandingHeader />

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🎓</div>
            <h1>Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <div className="form-options">
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn-auth">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider">
            <span></span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-800 font-medium">
              🎓 Your account is provided by the university
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Contact your administrator if you need access
            </p>
          </div>
        </div>
      </div>

      <footer className="auth-footer">
        <div className="auth-footer-content">
          <p>&copy; 2026 Academic Risk Detection System. All rights reserved.</p>
          <div className="auth-footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
