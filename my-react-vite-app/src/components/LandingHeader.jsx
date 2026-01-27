import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black ${scrolled ? 'shadow-lg py-4 border-b border-white/10' : 'py-6'
        }`}
    >
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between items-center w-full">
          {/* Logo Section - Left */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
              <span className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">🎓</span>
              <span className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                Academic Risk Detection
              </span>
            </a>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden xl:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
            <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white font-medium transition-colors text-base hover:text-blue-400">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-white font-medium transition-colors text-base hover:text-blue-400">
              How It Works
            </button>
            <button onClick={() => scrollToSection('roles')} className="text-gray-300 hover:text-white font-medium transition-colors text-base hover:text-blue-400">
              For You
            </button>
            <Link to="/about" className="text-gray-300 hover:text-white font-medium transition-colors text-base hover:text-blue-400">
              About
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white font-medium transition-colors text-base hover:text-blue-400">
              Contact
            </Link>
          </nav>

          {/* Auth Buttons - Right Aligned */}
          <div className="hidden xl:flex items-center gap-6 ml-auto">
            <Link
              to="/login"
              className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-full font-bold shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-base"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button - Right (Visible on small screens) */}
          <button
            className="xl:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors ml-auto"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="text-3xl">{isMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 transition-transform duration-300 xl:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ top: '80px' }}>
        <nav className="flex flex-col items-center justify-center h-full gap-8 p-8">
          <button onClick={() => scrollToSection('features')} className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            Features
          </button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            How It Works
          </button>
          <button onClick={() => scrollToSection('roles')} className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            For You
          </button>
          <Link to="/about" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link to="/contact" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>
          <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
            <Link to="/login" className="text-center w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-xl shadow-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default LandingHeader;
