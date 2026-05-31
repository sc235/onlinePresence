import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Connexion Admin — Cabinet Maître Ndiaye';
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, rgba(201,168,76,0.04), transparent 50%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom right, rgba(30,48,80,0.3), transparent 50%)' }} />

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-gold-500/20">
            <Scale className="w-8 h-8 text-navy-950" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-cream">Espace Administration</h1>
          <p className="text-sm text-cream/40 mt-2">Cabinet Maître Ndiaye</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <h2 className="text-lg font-heading font-semibold text-cream mb-6 text-center">Connexion</h2>

          {error && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            {/* Username */}
            <div>
              <label htmlFor="login-username" className="block text-sm text-cream/60 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                <input
                  type="text"
                  id="login-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-navy-800/50 border border-navy-600/30 text-cream placeholder-cream/30 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all text-sm outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm text-cream/60 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-navy-800/50 border border-navy-600/30 text-cream placeholder-cream/30 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-cream/30 hover:text-cream/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              id="login-submit-btn"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin"></div>
                  Connexion...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Se Connecter
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <p className="text-center mt-6">
          <a href="/" className="text-sm text-cream/30 hover:text-gold-400 transition-colors">
            ← Retour au site
          </a>
        </p>
      </div>
    </div>
  );
}
