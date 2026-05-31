const express = require('express');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');
const { validateContact } = require('../middleware/validate');
const nodemailer = require('nodemailer');

const router = express.Router();

// ──────────────────────────────────────────────
// Configuration Nodemailer
// ──────────────────────────────────────────────
let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  // Si les identifiants SMTP sont configurés, les utiliser
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Sinon, créer un compte de test Ethereal (développement uniquement)
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('📧 Compte email de test Ethereal créé :', testAccount.user);
    } catch (err) {
      console.warn('⚠️ Impossible de créer un compte Ethereal. Les emails ne seront pas envoyés.');
      return null;
    }
  }

  return transporter;
}

// ──────────────────────────────────────────────
// POST /api/contacts — Envoyer un message (public)
// ──────────────────────────────────────────────
router.post('/', validateContact, async (req, res) => {
  try {
    const { nom, email, telephone, sujet, message } = req.body;

    // Insérer le message en base de données
    const stmt = db.prepare(
      'INSERT INTO messages (nom, email, telephone, sujet, message) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(nom, email, telephone || null, sujet || null, message);

    // Envoyer une notification par email à l'administrateur
    try {
      const mailer = await getTransporter();
      if (mailer) {
        // Email de notification à l'admin
        const adminInfo = await mailer.sendMail({
          from: `"Cabinet Maître Ndiaye" <${process.env.SMTP_FROM || 'contact@cabinet-ndiaye.sn'}>`,
          to: process.env.SMTP_FROM || 'contact@cabinet-ndiaye.sn',
          subject: `📩 Nouveau message de ${nom} — ${sujet || 'Contact'}`,
          html: `
            <h2>Nouveau message reçu</h2>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding: 8px; font-weight: bold;">Nom :</td><td style="padding: 8px;">${nom}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email :</td><td style="padding: 8px;">${email}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Téléphone :</td><td style="padding: 8px;">${telephone || 'Non renseigné'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Sujet :</td><td style="padding: 8px;">${sujet || 'Non renseigné'}</td></tr>
            </table>
            <h3>Message :</h3>
            <p style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${message}</p>
          `
        });

        // Afficher le lien de prévisualisation Ethereal (dev uniquement)
        const previewUrl = nodemailer.getTestMessageUrl(adminInfo);
        if (previewUrl) {
          console.log('📧 Prévisualisation email admin:', previewUrl);
        }

        // Email de confirmation au client
        const clientInfo = await mailer.sendMail({
          from: `"Cabinet Maître Ndiaye" <${process.env.SMTP_FROM || 'contact@cabinet-ndiaye.sn'}>`,
          to: email,
          subject: 'Confirmation de réception — Cabinet Maître Ndiaye',
          html: `
            <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #0c1b33; padding: 24px; text-align: center;">
                <h1 style="color: #c9a84c; margin: 0;">Cabinet Maître Ndiaye</h1>
              </div>
              <div style="padding: 32px; background: #ffffff;">
                <p>Cher(e) <strong>${nom}</strong>,</p>
                <p>Nous avons bien reçu votre message et vous en remercions.</p>
                <p>Notre équipe examinera votre demande dans les plus brefs délais et vous recontactera sous 24 à 48 heures.</p>
                <p>Cordialement,</p>
                <p><strong>Cabinet Maître Cheikh Ahmadou Ndiaye</strong><br>
                13 bis place de l'indépendance, Dakar<br>
                +221 77 630 37 03</p>
              </div>
              <div style="background: #152238; padding: 16px; text-align: center; color: #888; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Cabinet Maître Ndiaye — Tous droits réservés</p>
              </div>
            </div>
          `
        });

        const clientPreview = nodemailer.getTestMessageUrl(clientInfo);
        if (clientPreview) {
          console.log('📧 Prévisualisation email client:', clientPreview);
        }
      }
    } catch (emailErr) {
      console.error('⚠️ Erreur envoi email (le message a quand même été enregistré):', emailErr.message);
    }

    res.status(201).json({
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
      id: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Erreur création contact:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// ──────────────────────────────────────────────
// GET /api/contacts — Liste tous les messages (admin)
// ──────────────────────────────────────────────
router.get('/', verifyToken, (req, res) => {
  try {
    const { statut, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = 'SELECT * FROM messages';
    let countQuery = 'SELECT COUNT(*) as total FROM messages';
    const params = [];

    if (statut) {
      query += ' WHERE statut = ?';
      countQuery += ' WHERE statut = ?';
      params.push(statut);
    }

    query += ' ORDER BY date_creation DESC LIMIT ? OFFSET ?';

    const total = db.prepare(countQuery).get(...params).total;
    const messages = db.prepare(query).all(...params, parseInt(limit), offset);

    res.json({
      messages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Erreur liste contacts:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// ──────────────────────────────────────────────
// GET /api/contacts/stats — Statistiques des messages (admin)
// ──────────────────────────────────────────────
router.get('/stats', verifyToken, (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM messages').get().count;
    const nouveau = db.prepare("SELECT COUNT(*) as count FROM messages WHERE statut = 'nouveau'").get().count;
    const lu = db.prepare("SELECT COUNT(*) as count FROM messages WHERE statut = 'lu'").get().count;
    const traite = db.prepare("SELECT COUNT(*) as count FROM messages WHERE statut = 'traité'").get().count;
    const totalDocs = db.prepare('SELECT COUNT(*) as count FROM documents').get().count;

    res.json({ total, nouveau, lu, traite, totalDocs });
  } catch (err) {
    console.error('Erreur stats:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// ──────────────────────────────────────────────
// GET /api/contacts/:id — Détail d'un message (admin)
// ──────────────────────────────────────────────
router.get('/:id', verifyToken, (req, res) => {
  try {
    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé.' });
    }

    // Récupérer les documents associés
    const documents = db.prepare('SELECT * FROM documents WHERE message_id = ?').all(req.params.id);

    res.json({ ...message, documents });
  } catch (err) {
    console.error('Erreur détail contact:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// ──────────────────────────────────────────────
// PATCH /api/contacts/:id/status — Mettre à jour le statut (admin)
// ──────────────────────────────────────────────
router.patch('/:id/status', verifyToken, (req, res) => {
  try {
    const { statut } = req.body;
    const validStatuts = ['nouveau', 'lu', 'traité'];

    if (!statut || !validStatuts.includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide. Valeurs acceptées : nouveau, lu, traité.' });
    }

    const result = db.prepare('UPDATE messages SET statut = ? WHERE id = ?')
      .run(statut, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Message non trouvé.' });
    }

    res.json({ message: 'Statut mis à jour avec succès.' });
  } catch (err) {
    console.error('Erreur mise à jour statut:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

// ──────────────────────────────────────────────
// DELETE /api/contacts/:id — Supprimer un message (admin)
// ──────────────────────────────────────────────
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Message non trouvé.' });
    }

    res.json({ message: 'Message supprimé avec succès.' });
  } catch (err) {
    console.error('Erreur suppression contact:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
