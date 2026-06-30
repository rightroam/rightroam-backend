const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');

// Profil utilisateur
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = {
      id: req.user.id,
      first_name: 'Jean', last_name: 'Dupont',
      email: req.user.email,
      nationality: 'Belge',
      passport_number: 'BE123456',
      phone: '+32 470 12 34 56',
      emergency_contact: '+32 470 99 88 77',
      language: 'fr',
      subscription: { plan_type: 'per_trip', status: 'active', price: 1.99 },
      active_trip: {
        destination_country: 'Espagne',
        destination_city: 'Madrid',
        start_date: '2025-06-10',
        end_date: '2025-06-20',
        is_active: true
      }
    };
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Compléter le profil (obligatoire avant paiement)
router.post('/complete-profile', authMiddleware, async (req, res) => {
  try {
    const {
      first_name, last_name, nationality,
      passport_number, phone, emergency_contact,
      birth_date, address
    } = req.body;

    const required = [first_name, last_name, nationality, passport_number, phone, emergency_contact];
    if (required.some(f => !f))
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis avant de continuer.' });

    // En production : UPDATE users SET ... WHERE id=$1, puis is_profile_complete = true
    res.json({ success: true, message: 'Profil complété. Vous pouvez maintenant choisir votre pass.', profile_complete: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Enregistrer les infos du voyage (obligatoire avant paiement)
router.post('/trips/register', authMiddleware, async (req, res) => {
  try {
    const { destination_country, destination_city, start_date, end_date } = req.body;

    if (!destination_country || !destination_city || !start_date || !end_date)
      return res.status(400).json({ error: 'Destination, ville et dates requises.' });

    if (new Date(start_date) < new Date())
      return res.status(400).json({ error: 'La date de départ ne peut pas être dans le passé.' });

    const trip = {
      id: require('uuid').v4(),
      user_id: req.user.id,
      destination_country,
      destination_city,
      start_date,
      end_date,
      is_active: false, // devient true au moment du départ
      created_at: new Date().toISOString()
    };

    // En production : INSERT INTO trips ... puis déclencher l'activation automatique à la date de départ
    res.status(201).json({ success: true, trip, message: 'Voyage enregistré. Votre protection s\'activera automatiquement à votre date de départ.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Activer manuellement un voyage
router.patch('/trips/:id/activate', authMiddleware, async (req, res) => {
  try {
    res.json({ success: true, message: 'Voyage activé — vous êtes maintenant protégé !' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Terminer un voyage
router.patch('/trips/:id/end', authMiddleware, async (req, res) => {
  try {
    res.json({ success: true, message: 'Voyage terminé. Bon retour !' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mes voyages
router.get('/trips', authMiddleware, async (req, res) => {
  try {
    const trips = [
      {
        id: 'trip-1',
        destination_country: 'Espagne', destination_city: 'Madrid',
        start_date: '2025-06-10', end_date: '2025-06-20',
        is_active: true
      }
    ];
    res.json({ success: true, trips });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
