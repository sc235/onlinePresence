import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale, LogOut, Mail, FileText, BarChart3, Inbox,
  Eye, Trash2, Download, Upload, CheckCircle, Clock,
  AlertCircle, X, ChevronLeft, ChevronRight, Filter,
  RefreshCw, Search, MessageSquare, File
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { contactsAPI, documentsAPI } from '../services/api';

// ──────────────────────────────────────────────
// SIDEBAR
// ──────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    const LOGIN_PATH = import.meta.env.VITE_ADMIN_LOGIN_PATH || '/login';
    navigate(LOGIN_PATH);
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-navy-900 border-r border-gold-500/10 flex flex-col min-h-screen fixed left-0 top-0 z-30" id="admin-sidebar">
      {/* Brand */}
      <div className="p-6 border-b border-gold-500/10">
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
            <Scale className="w-4.5 h-4.5 text-navy-950" />
          </div>
          <div>
            <div className="text-sm font-semibold text-cream font-heading">Cabinet</div>
            <div className="text-xs text-gold-400 tracking-wider uppercase">Admin</div>
          </div>
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            id={`admin-tab-${tab.id}`}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gold-500/10 text-gold-400 border border-gold-500/15'
                : 'text-cream/50 hover:text-cream hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-gold-500/10">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gold-500/15 flex items-center justify-center text-xs font-semibold text-gold-400">
            {admin?.username?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-cream truncate">{admin?.username || 'Admin'}</p>
            <p className="text-xs text-cream/30">Administrateur</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          id="admin-logout-btn"
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

// ──────────────────────────────────────────────
// STAT CARD
// ──────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color = 'gold' }) {
  const colors = {
    gold: 'bg-gold-500/15 text-gold-400 border-gold-500/15',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/15',
    green: 'bg-green-500/15 text-green-400 border-green-500/15',
    orange: 'bg-orange-500/15 text-orange-400 border-orange-500/15',
    red: 'bg-red-500/15 text-red-400 border-red-500/15',
  };

  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-heading font-bold text-cream">{value}</p>
        <p className="text-xs text-cream/40">{label}</p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// MESSAGE DETAIL MODAL
// ──────────────────────────────────────────────
function MessageModal({ message, onClose, onStatusChange }) {
  if (!message) return null;

  const statusColors = {
    nouveau: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    lu: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    'traité': 'bg-green-500/15 text-green-400 border-green-500/20',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative glass-card w-full max-w-lg max-h-[80vh] overflow-y-auto animate-scale-in" id="message-detail-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gold-500/10 sticky top-0 bg-navy-900/95 backdrop-blur-lg rounded-t-2xl">
          <h3 className="text-lg font-heading font-semibold text-cream">Détail du Message</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-cream/50" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[message.statut] || statusColors.nouveau}`}>
              {message.statut}
            </span>
            <span className="text-xs text-cream/30">
              {new Date(message.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-cream/40 uppercase tracking-wider">Nom</label>
              <p className="text-sm text-cream mt-0.5">{message.nom}</p>
            </div>
            <div>
              <label className="text-xs text-cream/40 uppercase tracking-wider">Email</label>
              <p className="text-sm text-cream mt-0.5">
                <a href={`mailto:${message.email}`} className="text-gold-400 hover:text-gold-300 transition-colors">{message.email}</a>
              </p>
            </div>
            {message.telephone && (
              <div>
                <label className="text-xs text-cream/40 uppercase tracking-wider">Téléphone</label>
                <p className="text-sm text-cream mt-0.5">
                  <a href={`tel:${message.telephone}`} className="text-gold-400 hover:text-gold-300 transition-colors">{message.telephone}</a>
                </p>
              </div>
            )}
            {message.sujet && (
              <div>
                <label className="text-xs text-cream/40 uppercase tracking-wider">Sujet</label>
                <p className="text-sm text-cream mt-0.5">{message.sujet}</p>
              </div>
            )}
            <div>
              <label className="text-xs text-cream/40 uppercase tracking-wider">Message</label>
              <p className="text-sm text-cream/80 mt-1 p-4 rounded-xl bg-navy-800/50 leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          </div>

          {/* Documents attached */}
          {message.documents && message.documents.length > 0 && (
            <div>
              <label className="text-xs text-cream/40 uppercase tracking-wider">Documents joints</label>
              <div className="mt-2 space-y-2">
                {message.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50">
                    <File className="w-4 h-4 text-gold-400" />
                    <span className="text-sm text-cream/70 flex-1 truncate">{doc.nom_fichier}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Change */}
          <div className="pt-4 border-t border-gold-500/10">
            <label className="text-xs text-cream/40 uppercase tracking-wider block mb-2">Changer le statut</label>
            <div className="flex gap-2">
              {['nouveau', 'lu', 'traité'].map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(message.id, s)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    message.statut === s
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                      : 'bg-navy-800/50 text-cream/50 hover:text-cream hover:bg-navy-700/50 border border-transparent'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// OVERVIEW TAB
// ──────────────────────────────────────────────
function OverviewTab({ stats, recentMessages, onViewMessage }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-heading font-semibold text-cream mb-6">Vue d'ensemble</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Inbox} label="Total Messages" value={stats.total} color="gold" />
          <StatCard icon={AlertCircle} label="Nouveaux" value={stats.nouveau} color="blue" />
          <StatCard icon={Eye} label="Lus" value={stats.lu} color="orange" />
          <StatCard icon={CheckCircle} label="Traités" value={stats.traite} color="green" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <StatCard icon={FileText} label="Documents Uploadés" value={stats.totalDocs} color="gold" />
        </div>
      </div>

      {/* Recent Messages */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-cream mb-4">Messages Récents</h3>
        <div className="glass-card overflow-hidden">
          {recentMessages.length === 0 ? (
            <div className="p-8 text-center text-cream/40">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Aucun message pour le moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-gold-500/5">
              {recentMessages.slice(0, 5).map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => onViewMessage(msg)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-navy-800/30 transition-colors text-left"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    msg.statut === 'nouveau' ? 'bg-blue-400' : msg.statut === 'lu' ? 'bg-orange-400' : 'bg-green-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-cream truncate">{msg.nom}</span>
                      <span className="text-xs text-cream/30 flex-shrink-0 ml-2">
                        {new Date(msg.date_creation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-xs text-cream/40 truncate">
                      {msg.sujet ? `${msg.sujet} — ` : ''}{msg.message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// MESSAGES TAB
// ──────────────────────────────────────────────
function MessagesTab({ onViewMessage }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchMessages = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (filter) params.statut = filter;
      const data = await contactsAPI.getAll(params);
      setMessages(data.messages);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      await contactsAPI.delete(id);
      fetchMessages(pagination.page);
    } catch (err) {
      alert(err.message);
    }
  };

  const statusColors = {
    nouveau: 'bg-blue-500/15 text-blue-400',
    lu: 'bg-orange-500/15 text-orange-400',
    'traité': 'bg-green-500/15 text-green-400',
  };

  const filtered = search
    ? messages.filter((m) =>
        m.nom.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        (m.sujet && m.sujet.toLowerCase().includes(search.toLowerCase()))
      )
    : messages;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-heading font-semibold text-cream">Messages</h2>
        <button
          onClick={() => fetchMessages(pagination.page)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-cream/50 hover:text-cream hover:bg-white/5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualiser
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-800/50 border border-navy-600/30 text-cream text-sm placeholder-cream/30 focus:border-gold-500/50 outline-none"
            id="messages-search"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: '', label: 'Tous' },
            { value: 'nouveau', label: 'Nouveaux' },
            { value: 'lu', label: 'Lus' },
            { value: 'traité', label: 'Traités' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filter === f.value
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                  : 'bg-navy-800/50 text-cream/50 hover:text-cream border border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-cream/40">Chargement...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-cream/40">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Aucun message trouvé.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold-500/10">
                    <th className="text-left px-5 py-3 text-xs font-medium text-cream/40 uppercase tracking-wider">Nom</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-cream/40 uppercase tracking-wider">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-cream/40 uppercase tracking-wider">Sujet</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-cream/40 uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-cream/40 uppercase tracking-wider">Statut</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-cream/40 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-500/5">
                  {filtered.map((msg) => (
                    <tr key={msg.id} className="hover:bg-navy-800/20 transition-colors">
                      <td className="px-5 py-4 text-sm text-cream">{msg.nom}</td>
                      <td className="px-5 py-4 text-sm text-cream/60">{msg.email}</td>
                      <td className="px-5 py-4 text-sm text-cream/50 max-w-[150px] truncate">{msg.sujet || '—'}</td>
                      <td className="px-5 py-4 text-xs text-cream/40">
                        {new Date(msg.date_creation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[msg.statut] || ''}`}>
                          {msg.statut}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewMessage(msg)}
                            className="p-2 hover:bg-gold-500/10 rounded-lg transition-colors"
                            title="Voir"
                          >
                            <Eye className="w-4 h-4 text-cream/50 hover:text-gold-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4 text-cream/50 hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gold-500/5">
              {filtered.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => onViewMessage(msg)}
                  className="w-full flex items-start gap-3 p-4 text-left hover:bg-navy-800/20 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    msg.statut === 'nouveau' ? 'bg-blue-400' : msg.statut === 'lu' ? 'bg-orange-400' : 'bg-green-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-cream">{msg.nom}</span>
                      <span className="text-xs text-cream/30">
                        {new Date(msg.date_creation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-xs text-cream/50 mt-0.5">{msg.email}</p>
                    <p className="text-xs text-cream/30 mt-1 truncate">{msg.message}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gold-500/10">
                <span className="text-xs text-cream/40">
                  Page {pagination.page} / {pagination.totalPages} ({pagination.total} messages)
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => fetchMessages(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-cream/50" />
                  </button>
                  <button
                    onClick={() => fetchMessages(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-cream/50" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// DOCUMENTS TAB
// ──────────────────────────────────────────────
function DocumentsTab() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await documentsAPI.getAll();
      setDocuments(data.documents);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      await documentsAPI.upload(formData);
      fetchDocuments();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDownload = async (doc) => {
    try {
      const blob = await documentsAPI.download(doc.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.nom_fichier;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce document ?')) return;
    try {
      await documentsAPI.delete(id);
      fetchDocuments();
    } catch (err) {
      alert(err.message);
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return '📄';
    if (type?.includes('word') || type?.includes('document')) return '📝';
    if (type?.includes('image')) return '🖼️';
    return '📎';
  };

  const formatSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-heading font-semibold text-cream">Documents</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchDocuments}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-cream/50 hover:text-cream hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualiser
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-medium text-xs rounded-lg cursor-pointer hover:from-gold-400 hover:to-gold-500 transition-all">
            <Upload className="w-3.5 h-3.5" />
            {uploading ? 'Upload...' : 'Uploader'}
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              onChange={handleUpload}
              className="hidden"
              id="documents-upload-input"
            />
          </label>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-cream/40">Chargement...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center text-cream/40">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Aucun document uploadé.</p>
            <p className="text-xs mt-1 text-cream/25">Utilisez le bouton "Uploader" pour ajouter des fichiers.</p>
          </div>
        ) : (
          <div className="divide-y divide-gold-500/5">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-4 hover:bg-navy-800/20 transition-colors">
                <span className="text-2xl">{getFileIcon(doc.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-cream truncate">{doc.nom_fichier}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                    <span className="text-xs text-cream/30">{formatSize(doc.taille)}</span>
                    <span className="text-xs text-cream/20">•</span>
                    <span className="text-xs text-cream/30">
                      {new Date(doc.date_upload).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    {doc.contact_nom && (
                      <>
                        <span className="text-xs text-cream/20">•</span>
                        <span className="text-xs text-gold-400/60">Lié à : {doc.contact_nom}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 hover:bg-gold-500/10 rounded-lg transition-colors"
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4 text-cream/50 hover:text-gold-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-cream/50 hover:text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// DASHBOARD PAGE
// ──────────────────────────────────────────────
export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ total: 0, nouveau: 0, lu: 0, traite: 0, totalDocs: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    const LOGIN_PATH = import.meta.env.VITE_ADMIN_LOGIN_PATH || '/login';
    navigate(LOGIN_PATH);
  };

  useEffect(() => {
    document.title = 'Dashboard Admin — Cabinet Maître Ndiaye';
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, messagesData] = await Promise.all([
        contactsAPI.getStats(),
        contactsAPI.getAll({ limit: 5 }),
      ]);
      setStats(statsData);
      setRecentMessages(messagesData.messages);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    }
  };

  const handleViewMessage = async (msg) => {
    try {
      const detail = await contactsAPI.getById(msg.id);
      setSelectedMessage(detail);
      // Auto mark as read
      if (msg.statut === 'nouveau') {
        await contactsAPI.updateStatus(msg.id, 'lu');
        loadDashboardData();
      }
    } catch (err) {
      setSelectedMessage(msg);
    }
  };

  const handleStatusChange = async (id, statut) => {
    try {
      await contactsAPI.updateStatus(id, statut);
      setSelectedMessage((prev) => prev ? { ...prev, statut } : null);
      loadDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-navy-900/95 backdrop-blur-lg border-b border-gold-500/10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
              <Scale className="w-4 h-4 text-navy-950" />
            </div>
            <span className="text-sm font-heading font-semibold text-cream">Admin</span>
          </div>
          <div className="flex gap-1">
            {[
              { id: 'overview', icon: BarChart3 },
              { id: 'messages', icon: Mail },
              { id: 'documents', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-2.5 rounded-lg transition-colors ${
                  activeTab === tab.id ? 'bg-gold-500/15 text-gold-400' : 'text-cream/40'
                }`}
              >
                <tab.icon className="w-4 h-4" />
              </button>
            ))}
            <div className="w-px h-6 bg-gold-500/10 self-center mx-1"></div>
            <button
              onClick={handleLogout}
              id="admin-mobile-logout-btn"
              className="p-2.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-10 pt-20 lg:pt-10 max-w-6xl">
          {activeTab === 'overview' && (
            <OverviewTab stats={stats} recentMessages={recentMessages} onViewMessage={handleViewMessage} />
          )}
          {activeTab === 'messages' && (
            <MessagesTab onViewMessage={handleViewMessage} />
          )}
          {activeTab === 'documents' && (
            <DocumentsTab />
          )}
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
