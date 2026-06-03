import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Scale } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center animate-pulse">
            <Scale className="w-6 h-6 text-navy-950" />
          </div>
          <p className="text-cream/50 text-sm">Vérification en cours...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const LOGIN_PATH = import.meta.env.VITE_ADMIN_LOGIN_PATH || '/login';
    return <Navigate to={LOGIN_PATH} replace />;
  }

  return children;
}
