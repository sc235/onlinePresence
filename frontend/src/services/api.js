/**
 * Client API — Cabinet d'Avocat
 * Wrapper fetch avec gestion JWT automatique
 * Connected to Railway production API
 */

let apiBase = import.meta.env.VITE_API_URL || '';
if (apiBase) {
  if (apiBase.endsWith('/')) {
    apiBase = apiBase.slice(0, -1);
  }
  if (!apiBase.endsWith('/api')) {
    apiBase = `${apiBase}/api`;
  }
} else {
  apiBase = '/api';
}
const API_BASE = apiBase;

/**
 * Effectue une requête API avec gestion automatique du JWT
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('cabinet_token');

  const config = {
    headers: {
      ...options.headers,
    },
    ...options,
  };

  // Ajouter le Content-Type JSON sauf pour FormData (upload)
  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  // Ajouter le token JWT si disponible
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Convertir le body en JSON si ce n'est pas FormData
  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  // Si 401, déconnecter automatiquement
  if (response.status === 401) {
    localStorage.removeItem('cabinet_token');
    localStorage.removeItem('cabinet_admin');
    // Ne pas rediriger si on est déjà sur login
    const LOGIN_PATH = import.meta.env.VITE_ADMIN_LOGIN_PATH || '/login';
    if (!window.location.pathname.includes(LOGIN_PATH)) {
      window.location.href = LOGIN_PATH;
    }
    throw new Error('Session expirée. Veuillez vous reconnecter.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.errors?.join(', ') || 'Une erreur est survenue.');
  }

  return data;
}

// ──────────────────────────────────────────────
// Auth API
// ──────────────────────────────────────────────
export const authAPI = {
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: { username, password },
    }),

  verify: () => request('/auth/verify'),
};

// ──────────────────────────────────────────────
// Contacts API
// ──────────────────────────────────────────────
export const contactsAPI = {
  // Public — Envoyer un message
  send: (data) =>
    request('/contacts', {
      method: 'POST',
      body: data,
    }),

  // Admin — Liste des messages
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/contacts${query ? `?${query}` : ''}`);
  },

  // Admin — Statistiques
  getStats: () => request('/contacts/stats'),

  // Admin — Détail d'un message
  getById: (id) => request(`/contacts/${id}`),

  // Admin — Mettre à jour le statut
  updateStatus: (id, statut) =>
    request(`/contacts/${id}/status`, {
      method: 'PATCH',
      body: { statut },
    }),

  // Admin — Confirmer ou refuser un rendez-vous
  updateRdvStatus: (id, statut, heure) =>
    request(`/contacts/${id}/rdv`, {
      method: 'PATCH',
      body: { statut, heure },
    }),

  // Admin — Supprimer un message
  delete: (id) =>
    request(`/contacts/${id}`, {
      method: 'DELETE',
    }),
};

// ──────────────────────────────────────────────
// Documents API
// ──────────────────────────────────────────────
export const documentsAPI = {
  // Admin — Upload de fichier(s)
  upload: (formData) =>
    request('/documents', {
      method: 'POST',
      body: formData,
    }),

  // Public — Upload fichier depuis formulaire contact
  uploadPublic: (formData) =>
    request('/documents/public', {
      method: 'POST',
      body: formData,
    }),

  // Admin — Liste des documents
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/documents${query ? `?${query}` : ''}`);
  },

  // Admin — Télécharger un document
  download: async (id) => {
    const token = localStorage.getItem('cabinet_token');
    const response = await fetch(`${API_BASE}/documents/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Erreur de téléchargement');
    return response.blob();
  },

  // Admin — Supprimer un document
  delete: (id) =>
    request(`/documents/${id}`, {
      method: 'DELETE',
    }),
};
