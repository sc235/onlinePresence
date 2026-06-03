import { Link } from 'react-router-dom';
import { Scale, MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Footer() {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();
  const ADMIN_PATH = import.meta.env.VITE_ADMIN_DASHBOARD_PATH || '/admin';

  const footerLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/a-propos', label: 'À propos' },
    { to: '/services', label: 'Services' },
    { to: '/contact', label: 'Contact' },
  ];

  if (isAuthenticated) {
    footerLinks.push({ to: ADMIN_PATH, label: 'Dashboard Admin' });
  }

  return (
    <footer id="main-footer" className="bg-navy-950 border-t border-gold-500/10">
      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <Scale className="w-5 h-5 text-navy-950" />
              </div>
              <div>
                <div className="text-sm font-semibold text-cream font-heading">Cabinet</div>
                <div className="text-xs text-gold-400 tracking-widest uppercase">Maître Ndiaye</div>
              </div>
            </Link>
            <p className="text-sm text-cream/50 leading-relaxed mb-6">
              Cabinet d'avocat de référence à Dakar, spécialisé en droit des affaires, OHADA, 
              droit maritime et droit des investissements.
            </p>
            <div className="gold-divider"></div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold-400 font-heading text-lg mb-6">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-cream/50 hover:text-gold-400 transition-colors duration-300 flex items-center gap-1 group"
                  >
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Expertise */}
          <div>
            <h4 className="text-gold-400 font-heading text-lg mb-6">Expertises</h4>
            <ul className="space-y-3">
              {[
                'Droit des Affaires',
                'Droit OHADA',
                'Droit Maritime',
                'Droit des Investissements',
              ].map((expertise) => (
                <li key={expertise}>
                  <span className="text-sm text-cream/50 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500/50"></span>
                    {expertise}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gold-400 font-heading text-lg mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-cream/50">13 bis place de l'indépendance<br />Dakar, Sénégal</span>
              </li>
              <li>
                <a href="tel:+221776303703" className="flex items-center gap-3 text-sm text-cream/50 hover:text-gold-400 transition-colors">
                  <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  +221 77 630 37 03
                </a>
              </li>
              <li>
                <a href="mailto:contact@cabinet-ndiaye.sn" className="flex items-center gap-3 text-sm text-cream/50 hover:text-gold-400 transition-colors">
                  <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  contact@cabinet-ndiaye.sn
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span className="text-sm text-cream/50">Lun — Ven : 8h — 18h</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold-500/5">
        <div className="section-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/30">
            © {currentYear} Cabinet Maître Cheikh Ahmadou Ndiaye — Tous droits réservés
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-cream/30 hover:text-gold-400 transition-colors">Mentions légales</a>
            <a href="#" className="text-xs text-cream/30 hover:text-gold-400 transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
