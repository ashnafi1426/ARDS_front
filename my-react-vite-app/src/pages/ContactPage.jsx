import { Link } from 'react-router-dom';
import LandingHeader from '../components/LandingHeader';
import '../styles/Landing.css';

const ContactPage = () => {
  return (
    <div className="landing-page">
      <LandingHeader />
      
      <section className="hero-section">
        <div className="hero-content" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 className="hero-title">Contact Us</h1>
          <p className="hero-subtitle">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <section className="features-section">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="feature-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Get in Touch</h3>
            
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Name
                </label>
                <input 
                  type="text" 
                  placeholder="Your name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Email
                </label>
                <input 
                  type="email" 
                  placeholder="your.email@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Subject
                </label>
                <input 
                  type="text" 
                  placeholder="How can we help?"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Message
                </label>
                <textarea 
                  rows="5"
                  placeholder="Your message..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button 
                type="submit"
                className="btn-primary-large"
                style={{ width: '100%' }}
              >
                Send Message
              </button>
            </form>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>Other Ways to Reach Us</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>
                📧 Email: support@academicrisksystem.com
              </p>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>
                📞 Phone: +1 (555) 123-4567
              </p>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>
                📍 Address: 123 Education Street, Learning City, ED 12345
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/" className="btn-secondary-large">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Academic Risk Detection</h4>
            <p>Empowering educational institutions with data-driven insights.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Academic Risk Detection System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
