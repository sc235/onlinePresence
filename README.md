# 🏛️ Cabinet Maître Ndiaye — Plateforme Web

Plateforme web complète pour la présence en ligne et la gestion interne d'un cabinet d'avocat basé à Dakar, Sénégal.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js v18+ 
- npm

### Installation

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Lancement

**Backend** (port 5000) :
```bash
cd backend
node server.js
```

**Frontend** (port 5173) :
```bash
cd frontend
npm run dev
```

Ouvrez http://localhost:5173 dans votre navigateur.

## 🔐 Accès Administration

- **URL** : http://localhost:5173/login
- **Utilisateur** : `admin`
- **Mot de passe** : `admin123`

> ⚠️ Changez ces identifiants en production en modifiant le fichier `backend/.env`

## 🏗️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express 5 |
| Base de données | SQLite (better-sqlite3) |
| Upload fichiers | Multer |
| Authentification | JWT (jsonwebtoken) |
| Emails | Nodemailer |
| Icônes | Lucide React |

## 📁 Structure du Projet

```
OnlinePresence/
├── frontend/           # Application React (Vite)
│   ├── src/
│   │   ├── components/ # Composants réutilisables
│   │   ├── contexts/   # Contexte d'authentification
│   │   ├── pages/      # Pages du site
│   │   └── services/   # Client API
│   └── ...
├── backend/            # API Express
│   ├── middleware/      # JWT + Validation
│   ├── routes/         # Auth, Contacts, Documents
│   ├── uploads/        # Fichiers uploadés
│   └── ...
└── README.md
```

## 🌐 Pages du Site

| Page | Route | Description |
|------|-------|-------------|
| Accueil | `/` | Présentation du cabinet, expertises, statistiques |
| À propos | `/a-propos` | Biographie, parcours, valeurs |
| Services | `/services` | Détail des 4 domaines d'expertise, FAQ |
| Contact | `/contact` | Formulaire, Google Maps, WhatsApp |
| Login | `/login` | Connexion administrateur |
| Dashboard | `/admin` | Gestion messages, documents, statistiques |

## ⚙️ API Endpoints

### Public
- `POST /api/contacts` — Envoyer un message de contact
- `POST /api/documents/public` — Upload fichier (formulaire contact)

### Protégé (JWT)
- `POST /api/auth/login` — Connexion admin
- `GET /api/auth/verify` — Vérifier le token
- `GET /api/contacts` — Liste des messages
- `GET /api/contacts/stats` — Statistiques
- `GET /api/contacts/:id` — Détail message
- `PATCH /api/contacts/:id/status` — Mettre à jour statut
- `DELETE /api/contacts/:id` — Supprimer message
- `POST /api/documents` — Upload fichier(s)
- `GET /api/documents` — Liste des documents
- `GET /api/documents/:id/download` — Télécharger
- `DELETE /api/documents/:id` — Supprimer document

## 📧 Configuration Email (Production)

Modifiez le fichier `backend/.env` :

```env
SMTP_HOST=smtp.votreprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre@email.com
SMTP_PASS=votre_mot_de_passe
SMTP_FROM=contact@cabinet-ndiaye.sn
```

## 📝 Licence

© 2026 Cabinet Maître Cheikh Ahmadou Ndiaye — Tous droits réservés
