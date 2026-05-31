require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Initialiser la base de données (crée les tables + seed admin)
const db = require('./db');

// Importer les routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const documentRoutes = require('./routes/documents');

const app = express();
const port = process.env.PORT || 5000;

// ──────────────────────────────────────────────
// Créer le dossier uploads s'il n'existe pas
// ──────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Dossier uploads/ créé.');
}

// ──────────────────────────────────────────────
// Middlewares de sécurité
// ──────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate Limiting — Max 100 requêtes par 15 minutes par IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard.' }
});
app.use('/api/', limiter);

// Servir les fichiers uploadés (protégé par les routes)
app.use('/uploads', express.static(uploadsDir));

// ──────────────────────────────────────────────
// Routes API
// ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/documents', documentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ──────────────────────────────────────────────
// Démarrage du serveur
// ──────────────────────────────────────────────
app.listen(port, () => {
  console.log(`\n⚖️  Serveur Cabinet d'Avocat`);
  console.log(`   → API: http://localhost:${port}/api`);
  console.log(`   → Health: http://localhost:${port}/api/health\n`);
});
