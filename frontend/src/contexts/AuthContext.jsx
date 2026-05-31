import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier le token au chargement
  useEffect(() => {
    const token = localStorage.getItem('cabinet_token');
    const savedAdmin = localStorage.getItem('cabinet_admin');

    if (token && savedAdmin) {
      // Vérifier que le token est encore valide
      authAPI.verify()
        .then((data) => {
          setAdmin(data.admin);
        })
        .catch(() => {
          // Token invalide, nettoyer
          localStorage.removeItem('cabinet_token');
          localStorage.removeItem('cabinet_admin');
          setAdmin(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const data = await authAPI.login(username, password);
    localStorage.setItem('cabinet_token', data.token);
    localStorage.setItem('cabinet_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cabinet_token');
    localStorage.removeItem('cabinet_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
