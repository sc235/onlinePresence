const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification JWT
 * Vérifie le token dans le header Authorization: Bearer <token>
 * Attache les données admin décodées à req.admin
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token d\'authentification requis.' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Format de token invalide.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré. Veuillez vous reconnecter.' });
    }
    return res.status(403).json({ error: 'Token invalide.' });
  }
}

module.exports = { verifyToken };
