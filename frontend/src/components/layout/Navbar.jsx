import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scale, Phone } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Accueil' },
  { path: '/a-propos', label: 'À propos' },
  { path: '/services', label: 'Services' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un changement de page
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-navy-950/95 backdrop-blur-lg shadow-lg shadow-black/20 border-b border-gold-500/10'
          : 'bg-transparent'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" id="navbar-logo">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg group-hover:shadow-gold-500/25 transition-all duration-300">
              <Scale className="w-5 h-5 text-navy-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-cream font-heading">Cabinet</span>
              <span className="text-xs text-gold-400 tracking-widest uppercase">Maître Ndiaye</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                id={`nav-link-${link.path.replace('/', '') || 'home'}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'text-gold-400 bg-gold-500/10'
                    : 'text-cream/70 hover:text-cream hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+221776303703"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gold-400 hover:text-gold-300 transition-colors"
              id="navbar-phone"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline">+221 77 630 37 03</span>
            </a>
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-sm rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg hover:shadow-gold-500/25 hover:-translate-y-0.5"
              id="navbar-cta"
            >
              Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-cream/80 hover:text-gold-400 transition-colors"
            id="mobile-menu-toggle"
            aria-label="Menu de navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-400 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-navy-900/95 backdrop-blur-xl border-t border-gold-500/10 px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === link.path
                  ? 'text-gold-400 bg-gold-500/10'
                  : 'text-cream/70 hover:text-cream hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gold-500/10">
            <a
              href="tel:+221776303703"
              className="flex items-center gap-2 px-4 py-3 text-sm text-gold-400"
            >
              <Phone className="w-4 h-4" />
              +221 77 630 37 03
            </a>
            <Link
              to="/contact"
              className="block mx-4 mt-2 px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-sm rounded-lg text-center"
            >
              Demander une Consultation
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
