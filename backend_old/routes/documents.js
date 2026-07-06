const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// ──────────────────────────────────────────────
// Configuration Multer
// ──────────────────────────────────────────────
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Nom unique : timestamp + random + extension originale
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Types acceptés : PDF, DOC, DOCX, JPG, PNG, WEBP.'));
    }
  }
});

// ──────────────────────────────────────────────
// POST /api/documents — Upload de fichier(s) (admin)
// ──────────────────────────────────────────────
router.post('/', verifyToken, (req, res) => {
  upload.array('files', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'La taille du fichier ne doit pas dépasser 10 MB.' });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ error: 'Maximum 5 fichiers par envoi.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier reçu.' });
    }

    try {
      const messageId = req.body.message_id || null;
      const insertStmt = db.prepare(
        'INSERT INTO documents (message_id, nom_fichier, chemin_fichier, type, taille) VALUES (?, ?, ?, ?, ?)'
      );

      const documents = [];
      const insertAll = db.transaction(() => {
        for (const file of req.files) {
          const result = insertStmt.run(
            messageId,
            file.originalname,
            file.filename,
            file.mimetype,
            file.size
          );
          documents.push({
            id: result.lastInsertRowid,
            nom_fichier: file.originalname,
            chemin_fichier: file.filename,
            type: file.mimetype,
            taille: file.size
          });
        }
      });

      insertAll();

      res.status(201).json({
        message: `${documents.length} fichier(s) uploadé(s) avec succès.`,
        documents
      });
    } catch (dbErr) {
      console.error('Erreur upload document:', dbErr);
      res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
  });
});

// ──────────────────────────────────────────────
// POST /api/documents/public — Upload fichier depuis formulaire contact (public)
// ──────────────────────────────────────────────
router.post('/public', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'La taille du fichier ne doit pas dépasser 10 MB.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier reçu.' });
    }

    try {
      const messageId = req.body.message_id || null;
      const result = db.prepare(
        'INSERT INTO documents (message_id, nom_fichier, chemin_fichier, type, taille) VALUES (?, ?, ?, ?, ?)'
      ).run(messageId, req.file.originalname, req.file.filename, req.file.mimetype, req.file.size);

      res.status(201).json({
        message: 'Fichier uploadé avec succès.',
        document: {
          id: result.lastInsertRowid,
          nom_fichier: req.file.originalname,
          chemin_fichier: req.file.filename,
          type: req.file.mimetype,
          taille: req.file.size
        }
      });
    } catch (dbErr) {
      console.error('Erreur upload document public:', dbErr);
      res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
  });
});

// ──────────────────────────────────────────────
// GET /api/documents — Liste tous les documents (admin)
// ──────────────────────────────────────────────
router.get('/', verifyToken, (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const total = db.prepare('SELECT COUNT(*) as count FROM documents').get().count;
    const documents = db.prepare(
      'SELECT d.*, m.nom as contact_nom FROM documents d LEFT JOIN messages m ON d.message_id = m.id ORDER BY d.date_upload DESC LIMIT ? OFFSET ?'
    ).all(parseInt(limit), offset);

    res.json({
      documents,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Erreur liste documents:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// ──────────────────────────────────────────────
// GET /api/documents/:id/download — Télécharger un document (admin)
// ──────────────────────────────────────────────
router.get('/:id/download', verifyToken, (req, res) => {
  try {
    const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);

    if (!doc) {
      return res.status(404).json({ error: 'Document non trouvé.' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', doc.chemin_fichier);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier non trouvé sur le serveur.' });
    }

    res.download(filePath, doc.nom_fichier);
  } catch (err) {
    console.error('Erreur téléchargement document:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// ──────────────────────────────────────────────
// DELETE /api/documents/:id — Supprimer un document (admin)
// ──────────────────────────────────────────────
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);

    if (!doc) {
      return res.status(404).json({ error: 'Document non trouvé.' });
    }

    // Supprimer le fichier physique
    const filePath = path.join(__dirname, '..', 'uploads', doc.chemin_fichier);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer l'entrée en base
    db.prepare('DELETE FROM documents WHERE id = ?').run(req.params.id);

    res.json({ message: 'Document supprimé avec succès.' });
  } catch (err) {
    console.error('Erreur suppression document:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
