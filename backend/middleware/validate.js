/**
 * Middleware de validation du formulaire de contact
 * Vérifie les champs requis et sanitize les inputs
 */
function validateContact(req, res, next) {
  const { nom, email, message } = req.body;
  const errors = [];

  // Vérification des champs requis
  if (!nom || typeof nom !== 'string' || nom.trim().length === 0) {
    errors.push('Le nom est requis.');
  } else if (nom.trim().length > 100) {
    errors.push('Le nom ne doit pas dépasser 100 caractères.');
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('L\'email est requis.');
  } else {
    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('L\'email n\'est pas valide.');
    }
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    errors.push('Le message est requis.');
  } else if (message.trim().length > 5000) {
    errors.push('Le message ne doit pas dépasser 5000 caractères.');
  }

  // Vérification optionnelle du téléphone
  if (req.body.telephone) {
    const tel = req.body.telephone.trim();
    if (tel.length > 20) {
      errors.push('Le numéro de téléphone ne doit pas dépasser 20 caractères.');
    }
  }

  // Vérification optionnelle du sujet
  if (req.body.sujet && req.body.sujet.trim().length > 200) {
    errors.push('Le sujet ne doit pas dépasser 200 caractères.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Sanitization — trim de tous les champs
  req.body.nom = nom.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.message = message.trim();
  if (req.body.telephone) req.body.telephone = req.body.telephone.trim();
  if (req.body.sujet) req.body.sujet = req.body.sujet.trim();

  next();
}

module.exports = { validateContact };
