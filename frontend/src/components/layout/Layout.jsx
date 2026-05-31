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
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname === '/login';

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
