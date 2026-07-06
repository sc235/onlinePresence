const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

// Chemin vers le fichier de base de données SQLite
const dbPath = path.join(__dirname, 'cabinet_avocat.db');
const db = new Database(dbPath);

// Activer le mode WAL pour de meilleures performances
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ──────────────────────────────────────────────
// Création des tables
// ──────────────────────────────────────────────
db.exec(`
  -- Table des administrateurs
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Table des messages / contacts
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT,
    sujet TEXT,
    message TEXT NOT NULL,
    statut TEXT DEFAULT 'nouveau',
    date_creation TEXT DEFAULT (datetime('now')),
    rdv_date TEXT DEFAULT NULL,
    rdv_heure TEXT DEFAULT NULL,
    rdv_statut TEXT DEFAULT NULL
  );

  -- Table des documents uploadés
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER,
    nom_fichier TEXT NOT NULL,
    chemin_fichier TEXT NOT NULL,
    type TEXT,
    taille INTEGER,
    date_upload TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE SET NULL
  );
`);

// Mises à jour progressives pour les bases de données existantes
try {
  db.exec("ALTER TABLE messages ADD COLUMN rdv_date TEXT DEFAULT NULL;");
} catch (e) {
  // Ignorer si la colonne existe déjà
}
try {
  db.exec("ALTER TABLE messages ADD COLUMN rdv_heure TEXT DEFAULT NULL;");
} catch (e) {
  // Ignorer si la colonne existe déjà
}
try {
  db.exec("ALTER TABLE messages ADD COLUMN rdv_statut TEXT DEFAULT NULL;");
} catch (e) {
  // Ignorer si la colonne existe déjà
}


// ──────────────────────────────────────────────
// Seed du compte administrateur par défaut
// ──────────────────────────────────────────────
const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get();
if (adminCount.count === 0) {
  const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
  const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(defaultPassword, salt);

  try {
    db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)')
      .run(defaultUsername, hash);
    console.log(`👤 Compte administrateur "${defaultUsername}" créé avec succès.`);
  } catch (err) {
    console.error('Erreur lors de la création du compte admin :', err.message);
  }
}

module.exports = db;
