import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '../ui/WhatsAppButton';

export default function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Don't show Navbar/Footer on admin pages
  const LOGIN_PATH = import.meta.env.VITE_ADMIN_LOGIN_PATH || '/login';
  const ADMIN_PATH = import.meta.env.VITE_ADMIN_DASHBOARD_PATH || '/admin';
  const isAdminPage = location.pathname.startsWith(ADMIN_PATH) || location.pathname === LOGIN_PATH;

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && <Navbar />}
      <main className={`flex-1 ${!isAdminPage ? 'pt-20' : ''}`}>
        <Outlet />
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsAppButton />}
    </div>
  );
}
