const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Inscription voyageur (étape 1 — infos de base)
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password, language } = req.body;
    if (!first_name || !last_name || !email || !password)
      return res.status(400).json({ error: 'Champs obligatoires manquants' });

    const password_hash = await bcrypt.hash(password, 12);
    const user = {
      id: uuidv4(), first_name, last_name, email,
      language: language || 'fr',
      profile_complete: false, // doit compléter avant de payer
    };
    const token = generateToken({ id: user.id, type: 'user', email });
    res.status(201).json({
      success: true, user, token,
      next_step: 'complete_profile',
      message: 'Compte créé ! Complétez votre profil et enregistrez votre voyage avant de payer.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Connexion voyageur
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // En production : SELECT + bcrypt.compare
    const user = {
      id: 'demo-user-id', first_name: 'Jean', last_name: 'Dupont',
      email, profile_complete: true
    };
    const token = generateToken({ id: user.id, type: 'user', email });
    res.json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Inscription avocat
router.post('/lawyer/register', async (req, res) => {
  try {
    const {
      first_name, last_name, email, password,
      bar_number, bar_country, city, country,
      specialties, languages, id_document_url, bar_certificate_url
    } = req.body;

    if (!bar_number || !bar_country || !city || !country)
      return res.status(400).json({ error: 'Numéro de barreau, pays et ville obligatoires' });

    if (!bar_certificate_url)
      return res.status(400).json({ error: 'Certificat du barreau obligatoire pour vérification' });

    const password_hash = await bcrypt.hash(password, 12);
    const lawyer = {
      id: uuidv4(), first_name, last_name, email,
      bar_number, bar_country, city, country,
      specialties: specialties || [],
      languages: languages || [],
      is_verified: false, // RightRoam vérifie manuellement
      is_available: false,
      rating: 0, total_cases: 0
    };
    const token = generateToken({ id: lawyer.id, type: 'lawyer', email });
    res.status(201).json({
      success: true, lawyer, token,
      message: 'Inscription reçue ! Votre certificat de barreau est en cours de vérification par notre équipe (24 à 48h). Vous recevrez un email de confirmation.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Connexion avocat
router.post('/lawyer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const lawyer = {
      id: 'demo-lawyer-id', first_name: 'María', last_name: 'Rodriguez',
      email, is_verified: true, city: 'Madrid', country: 'Espagne'
    };
    const token = generateToken({ id: lawyer.id, type: 'lawyer', email });
    res.json({ success: true, lawyer, token });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
