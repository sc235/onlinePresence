const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// ──────────────────────────────────────────────
// POST /api/auth/login — Connexion administrateur
// ──────────────────────────────────────────────
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis.' });
    }

    // Rechercher l'admin par username
    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);

    if (!admin) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }

    // Vérifier le mot de passe
    const isValidPassword = bcrypt.compareSync(password, admin.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      message: 'Connexion réussie.',
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// ──────────────────────────────────────────────
// GET /api/auth/verify — Vérifier un token JWT
// ──────────────────────────────────────────────
router.get('/verify', verifyToken, (req, res) => {
  res.json({
    valid: true,
    admin: {
      id: req.admin.id,
      username: req.admin.username
    }
  });
});

module.exports = router;
