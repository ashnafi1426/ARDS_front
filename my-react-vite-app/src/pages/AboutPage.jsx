import { Link } from 'react-router-dom';
import LandingHeader from '../components/LandingHeader';
import '../styles/Landing.css';
import '../styles/About.css';

const AboutPage = () => {
  return (
    <div className="landing-page">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h1 className="hero-title">About Our Project</h1>
          <p className="hero-subtitle">
            Academic Risk Detection System - Transforming student success through early intervention and data-driven insights
          </p>
        </div>
      </section>
      {/* Main Content */}
      <div className="about-container">
        
        {/* 1. Mission Section */}
        <section className="about-section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-number">1️⃣</div>
            <h2 className="about-title">Mission & Vision</h2>
            
            <div className="about-card">
              <h3>🎯 Vision</h3>
              <p>To create a university environment where students succeed before failure occurs.</p>
            </div>

            <div className="about-card">
              <h3>🚀 Mission</h3>
              <p>To detect academic risk early and support students through data-driven insights.</p>
            </div>

            <div className="about-card">
              <h3>📖 Origin Story</h3>
              <p>Many students fail or drop out without warning because universities react too late. This project was created to change that. We believe every student deserves the opportunity to succeed, and early intervention is the key to preventing academic failure.</p>
            </div>
          </div>
        </section>

        {/* 2. Problem Section */}
        <section className="about-section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-number">2️⃣</div>
            <h2 className="about-title">The Problem</h2>
            
            <div className="problem-grid">
              <div className="problem-card">
                <div className="problem-icon">⚠️</div>
                <h4>Students fail courses without early warnings</h4>
              </div>
              <div className="problem-card">
                <div className="problem-icon">📉</div>
                <h4>Advisors notice problems only after GPA drops</h4>
              </div>
              <div className="problem-card">
                <div className="problem-icon">🔧</div>
                <h4>Universities lack early intervention tools</h4>
              </div>
              <div className="problem-card">
                <div className="problem-icon">💔</div>
                <h4>Dropouts affect students and institutions</h4>
              </div>
            </div>
            
            <div className="alert-box">
              ❗️ This problem occurs every semester, affecting thousands of students.
            </div>
          </div>
        </section>

        {/* 3. Solution Section */}
        <section className="about-section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-number">3️⃣</div>
            <h2 className="about-title">Our Solution</h2>
            
            <p className="section-intro">A web-based system that provides preventive, not reactive support:</p>
            
            <div className="solution-grid">
              <div className="solution-item">
                <span className="check-icon">✅</span>
                <span>Monitors attendance, GPA trends, and workload</span>
              </div>
              <div className="solution-item">
                <span className="check-icon">✅</span>
                <span>Calculates academic risk scores using AI</span>
              </div>
              <div className="solution-item">
                <span className="check-icon">✅</span>
                <span>Sends early alerts to students and advisors</span>
              </div>
              <div className="solution-item">
                <span className="check-icon">✅</span>
                <span>Enables early academic intervention</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Market Size Section */}
        <section className="about-section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-number">4️⃣</div>
            <h2 className="about-title">Market Size</h2>
            
            <div className="market-grid">
              <div className="market-card">
                <h3>TAM</h3>
                <p className="market-label">Total Addressable Market</p>
                <p>All university students globally</p>
              </div>
              <div className="market-card">
                <h3>SAM</h3>
                <p className="market-label">Serviceable Available Market</p>
                <p>Universities using digital systems in your country</p>
              </div>
              <div className="market-card">
                <h3>SOM</h3>
                <p className="market-label">Serviceable Obtainable Market</p>
                <p>1-2 universities for pilot implementation</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Business Model Section */}
        <section className="about-section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-number">5️⃣</div>
            <h2 className="about-title">Business Model</h2>
            
            <div className="about-card">
              <h3>💰 Revenue Strategy</h3>
              <p>Universities pay an annual license fee to use the system for student risk monitoring.</p>
              
              <div className="business-options">
                <div className="business-option">
                  <strong>Subscription Model:</strong> Per university annual fee
                </div>
                <div className="business-option">
                  <strong>License Model:</strong> Per student pricing
                </div>
                <div className="business-option">
                  <strong>Institutional Model:</strong> Free for students, paid by institution
                </div>
                <div className="business-option">
                  <strong>Grant Funding:</strong> Government/NGO support
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Competition Section */}
        <section className="about-section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-number">6️⃣</div>
            <h2 className="about-title">Competitive Advantage</h2>
            
            <div className="comparison-table">
              <div className="comparison-header">
                <div>Feature</div>
                <div>Others</div>
                <div>Our System</div>
              </div>
              <div className="comparison-row">
                <div>Early risk detection</div>
                <div className="no">❌</div>
                <div className="yes">✅</div>
              </div>
              <div className="comparison-row">
                <div>Predictive alerts</div>
                <div className="no">❌</div>
                <div className="yes">✅</div>
              </div>
              <div className="comparison-row">
                <div>Student self-check</div>
                <div className="no">❌</div>
                <div className="yes">✅</div>
              </div>
              <div className="comparison-row">
                <div>Advisor dashboard</div>
                <div className="limited">Limited</div>
                <div className="yes">Advanced</div>
              </div>
            </div>

            <p className="competitors-note">
              <strong>Typical Competitors:</strong> LMS (Moodle, Blackboard), Manual advisor systems, Spreadsheet tracking
            </p>
          </div>
        </section>

        {/* 7. Why Now Section */}
        <section className="about-section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-number">7️⃣</div>
            <h2 className="about-title">Why Now?</h2>
            
            <div className="why-now-grid">
              <div className="why-now-card">
                <div className="why-now-icon">📈</div>
                <h4>Increased Student Stress</h4>
                <p>Mental health and academic pressure at all-time high</p>
              </div>
              <div className="why-now-card">
                <div className="why-now-icon">💻</div>
                <h4>Digital Transformation</h4>
                <p>Universities adopting data-driven solutions</p>
              </div>
              <div className="why-now-card">
                <div className="why-now-icon">📉</div>
                <h4>High Dropout Rates</h4>
                <p>Institutions seeking retention solutions</p>
              </div>
              <div className="why-now-card">
                <div className="why-now-icon">🌍</div>
                <h4>Post-Pandemic Challenges</h4>
                <p>New learning environment requires new tools</p>
              </div>
            </div>

            <div className="highlight-box">
              Now is the right time because universities are shifting toward data-driven student support systems.
            </div>
          </div>
        </section>

        {/* 8. Go-To-Market Section */}
        <section className="about-section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-number">8️⃣</div>
            <h2 className="about-title">Go-To-Market Strategy</h2>
            
            <div className="gtm-timeline">
              <div className="gtm-step">
                <div className="gtm-number">1</div>
                <h4>Pilot Program</h4>
                <p>Launch in one department</p>
              </div>
              <div className="gtm-arrow">→</div>
              <div className="gtm-step">
                <div className="gtm-number">2</div>
                <h4>Faculty Workshops</h4>
                <p>Train advisors and staff</p>
              </div>
              <div className="gtm-arrow">→</div>
              <div className="gtm-step">
                <div className="gtm-number">3</div>
                <h4>Student Orientation</h4>
                <p>Demonstrate value to students</p>
              </div>
              <div className="gtm-arrow">→</div>
              <div className="gtm-step">
                <div className="gtm-number">4</div>
                <h4>Scale Up</h4>
                <p>Expand across university</p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Team Section */}
        <section className="about-section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-number">9️⃣</div>
            <h2 className="about-title">Our Team</h2>
            
            <div className="team-grid">
              <div className="team-card">
                <div className="team-icon">👨‍💼</div>
                <h4>Founder</h4>
                <p>Strong understanding of academic systems and student challenges</p>
              </div>
              <div className="team-card">
                <div className="team-icon">💻</div>
                <h4>Technical Team</h4>
                <p>Expert web development and AI/ML skills</p>
              </div>
              <div className="team-card">
                <div className="team-icon">🎓</div>
                <h4>Domain Knowledge</h4>
                <p>University experience and educational expertise</p>
              </div>
            </div>

            <div className="highlight-box">
              ✔️ We understand the problem because we live it.
            </div>
          </div>
        </section>

        {/* 10. Why This Structure Section */}
        <section className="about-section">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-number">🎯</div>
            <h2 className="about-title">Why This Structure Matters</h2>
            
            <div className="structure-grid">
              <div className="structure-item">
                <span className="structure-icon">✔️</span>
                <span>Logical flow from problem to solution</span>
              </div>
              <div className="structure-item">
                <span className="structure-icon">✔️</span>
                <span>Easy to defend in presentations</span>
              </div>
              <div className="structure-item">
                <span className="structure-icon">✔️</span>
                <span>Used by universities & startups</span>
              </div>
              <div className="structure-item">
                <span className="structure-icon">✔️</span>
                <span>Clear problem → solution → impact</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <h2>Ready to Transform Student Success?</h2>
          <p>Join us in creating a future where every student has the support they need to succeed.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link to="/register" className="btn-primary-large">
              Sign Up Free
            </Link>
            <Link to="/contact" className="btn-secondary-large">
              Contact Us
            </Link>
            <Link to="/" className="btn-secondary-large">
              Back to Home
            </Link>
          </div>
        </section>

      </div>

      {/* Footer */}
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

export default AboutPage;
