const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');

// Créer un nouveau dossier juridique
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { lawyer_id, case_type, description, urgency, latitude, longitude, country, city } = req.body;
    const newCase = {
      id: require('uuid').v4(),
      user_id: req.user.id,
      lawyer_id, case_type, description,
      urgency: urgency || 'normal',
      status: 'pending',
      country, city, latitude, longitude,
      created_at: new Date().toISOString()
    };
    // En production : INSERT INTO cases ...
    // Envoyer notification push à l'avocat
    res.status(201).json({ success: true, case: newCase, message: 'Dossier créé, avocat notifié' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Lister mes dossiers (voyageur)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const cases = [
      {
        id: 'case-1', case_type: 'accident', status: 'resolved',
        description: 'Accident de voiture à Madrid',
        country: 'Espagne', city: 'Madrid',
        lawyer: { first_name: 'María', last_name: 'Rodriguez', rating: 4.9 },
        created_at: '2025-06-10T14:30:00Z', resolved_at: '2025-06-10T18:00:00Z'
      }
    ];
    res.json({ success: true, cases });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Dossiers de l'avocat
router.get('/lawyer/my', authMiddleware, async (req, res) => {
  try {
    if (req.user.type !== 'lawyer')
      return res.status(403).json({ error: 'Réservé aux avocats' });
    const cases = [
      {
        id: 'case-2', case_type: 'hotel_dispute', status: 'in_progress',
        description: 'Litige avec hôtel - remboursement refusé',
        urgency: 'normal',
        user: { first_name: 'Sarah', last_name: 'M.', nationality: 'Britannique', language: 'en' },
        country: 'Espagne', city: 'Madrid',
        created_at: '2025-06-12T09:15:00Z'
      },
      {
        id: 'case-3', case_type: 'accident', status: 'pending',
        description: 'Accident de voiture - autre conducteur refuse de coopérer',
        urgency: 'urgent',
        user: { first_name: 'Jean', last_name: 'D.', nationality: 'Belge', language: 'fr' },
        country: 'Espagne', city: 'Madrid',
        created_at: new Date().toISOString()
      }
    ];
    res.json({ success: true, cases, pending: cases.filter(c => c.status === 'pending').length });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Accepter / refuser un dossier (avocat)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'in_progress', 'resolved', 'cancelled'].includes(status))
      return res.status(400).json({ error: 'Statut invalide' });
    // En production : UPDATE cases SET status=$1 WHERE id=$2
    res.json({ success: true, case_id: req.params.id, status, message: `Dossier ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Soumettre une évaluation
router.post('/:id/review', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Note entre 1 et 5' });
    // En production : INSERT INTO reviews + UPDATE lawyers SET rating=...
    res.json({ success: true, message: 'Évaluation enregistrée, merci !' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
