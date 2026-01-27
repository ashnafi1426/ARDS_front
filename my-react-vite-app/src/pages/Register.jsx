import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/login.service';
import LandingHeader from '../components/LandingHeader';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('📝 Starting registration with data:', { ...formData, password: '***' });
      
      // Transform form data to match backend expectations
      const registrationData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role || 'student',
      };

      const response = await register(registrationData);

      if (!response || !response.user || !response.token) {
        console.error('❌ Registration returned invalid response:', response);
        setError('Registration failed. Invalid response from server.');
        setLoading(false);
        return;
      }

      const { user, token } = response;

      if (!user || !user.role) {
        console.error('❌ Registration returned invalid user data:', user);
        setError('Registration failed. Invalid user data returned from server.');
        setLoading(false);
        return;
      }

      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      console.log('✅ Registration successful, user:', user);
      console.log('👤 User role:', user.role);
      console.log('🚀 Redirecting to:', user.role === 'admin' ? '/admin/dashboard' : user.role === 'advisor' ? '/advisor/dashboard' : '/student/dashboard');

      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate('/redirect', { replace: true });
      }, 100);
      
    } catch (err) {
      console.error('❌ Registration error:', err);
      const errorMsg = err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
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
            <h1>Create Account</h1>
            <p className="auth-subtitle">Join Academic Risk Detection System</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  aria-label="First name"
                  placeholder="First name"
                />
              </div>
              
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  aria-label="Last name"
                  placeholder="Last name"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                aria-label="Email address"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength="6"
                aria-label="Password"
                placeholder="Create password (min 6 characters)"
              />
            </div>
            
            <div className="form-group">
              <label>I am a</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                aria-label="User role"
              >
                <option value="student">Student</option>
                <option value="advisor">Advisor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary btn-auth">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>
          
          <p className="auth-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
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

export default Register;
