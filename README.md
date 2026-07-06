# 🏛️ Cabinet Maître Ndiaye — Plateforme Web

Plateforme web complète pour la présence en ligne et la gestion interne d'un cabinet d'avocat basé à Dakar, Sénégal.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js v18+
- npm
- PostgreSQL (installé et actif)

### Installation

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Configuration Base de Données & Environnement

Créez une base de données PostgreSQL nommée `rdv`.
Dans le dossier `backend`, configurez vos accès dans le fichier `.env` :

```env
PORT=5000
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173

# Configuration PostgreSQL
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=rdv
```

### Migration & Initialisation des Tables

Exécutez la commande suivante pour générer le schéma de la base de données et pré-remplir le compte administrateur initial :

```bash
cd backend
npm run migrate
```

### Lancement des Serveurs

**Backend** (port 5000) :
```bash
cd backend
npm run dev
```
*L'API est accessible sur http://localhost:5000/api et la documentation Swagger sur http://localhost:5000/explorer*

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

> ⚠️ Changez le mot de passe ou désactivez ces identifiants par défaut en production.

## 🏗️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Backend | Node.js + LoopBack 4 (TypeScript) |
| Base de données | PostgreSQL |
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
├── backend/            # API LoopBack 4
│   ├── src/
│   │   ├── controllers/ # Routes et logique métier
│   │   ├── datasources/ # Connexion base de données (PostgreSQL)
│   │   ├── models/      # Modèles de données
│   │   ├── repositories/# Couche d'accès aux données
│   │   ├── migrate.ts   # Script de migration
│   │   └── index.ts     # Point d'entrée
│   └── ...
└── README.md
```

## 🌐 Pages du Site

| Page | Route | Description |
|------|-------|-------------|
| Accueil | `/` | Présentation du cabinet, expertises, statistiques |
| À propos | `/a-propos` | Biographie, parcours, valeurs |
| Services | `/services` | Détail des 4 domaines d'expertise, FAQ |
| Contact | `/contact` | Formulaire de contact, demande de rendez-vous, upload de pièces jointes |
| Login | `/login` | Connexion administrateur |
| Dashboard | `/admin` | Gestion des messages, documents, statistiques |

## ⚙️ API Endpoints

### Public
- `POST /api/contacts` — Envoyer un message ou une demande de rdv
- `POST /api/documents/public` — Uploader une pièce jointe (formulaire contact)

### Protégé (JWT)
- `POST /api/auth/login` — Connexion admin
- `GET /api/auth/verify` — Vérifier la validité du token
- `GET /api/contacts` — Liste paginée des messages
- `GET /api/contacts/stats` — Statistiques d'activité
- `GET /api/contacts/:id` — Détail d'un message + pièces jointes associées
- `PATCH /api/contacts/:id/status` — Mettre à jour le statut du message
- `PATCH /api/contacts/:id/rdv` — Valider / refuser un rendez-vous (avec envoi d'emails)
- `DELETE /api/contacts/:id` — Supprimer un message
- `POST /api/documents` — Uploader des fichiers (admin)
- `GET /api/documents` — Liste paginée de tous les documents
- `GET /api/documents/:id/download` — Télécharger un fichier joint
- `DELETE /api/documents/:id` — Supprimer un fichier joint

## 📧 Configuration Email (Production)

Modifiez le fichier `backend/.env` avec les identifiants SMTP de votre fournisseur :

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
