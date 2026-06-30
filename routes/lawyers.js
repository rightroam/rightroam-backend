const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');

// Rechercher avocats par ville
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { city, country, case_type, language } = req.query;
    if (!city) return res.status(400).json({ error: 'Ville requise' });

    // En production : SELECT * FROM lawyers
    // WHERE is_verified = true AND cities @> ARRAY[$1]
    // ORDER BY is_available DESC, rating DESC LIMIT 20

    const lawyers = [
      {
        id: '1', first_name: 'María', last_name: 'Rodriguez',
        specialties: ['Droit pénal', 'Droit civil', 'Accidents'],
        languages: ['fr', 'en', 'es'],
        cities: ['Madrid', 'Barcelone'],
        country: 'Espagne',
        rating: 4.9, total_cases: 127,
        is_available: true,
      },
      {
        id: '2', first_name: 'Alejandro', last_name: 'García',
        specialties: ['Droit du tourisme', 'Litiges hôtels'],
        languages: ['en', 'es', 'de'],
        cities: ['Madrid', 'Séville'],
        country: 'Espagne',
        rating: 4.7, total_cases: 89,
        is_available: true,
      },
      {
        id: '3', first_name: 'Laura', last_name: 'Pérez',
        specialties: ['Droit civil', 'Litiges consommateurs'],
        languages: ['fr', 'es', 'pt'],
        cities: ['Madrid'],
        country: 'Espagne',
        rating: 4.8, total_cases: 203,
        is_available: false, available_in_minutes: 30,
      }
    ];

    let filtered = lawyers.filter(l =>
      l.cities.some(c => c.toLowerCase().includes(city.toLowerCase()))
    );
    if (language) filtered = filtered.filter(l => l.languages.includes(language));

    res.json({ success: true, lawyers: filtered, count: filtered.length, city });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Profil avocat
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const lawyer = {
      id: req.params.id,
      first_name: 'María', last_name: 'Rodriguez',
      specialties: ['Droit pénal', 'Accidents', 'Litiges'],
      languages: ['fr', 'en', 'es'],
      bio: 'Avocate spécialisée en assistance aux voyageurs étrangers depuis 8 ans.',
      cities: ['Madrid', 'Barcelone'],
      country: 'Espagne',
      bar_number: 'MAD-12345', is_verified: true,
      rating: 4.9, total_cases: 127,
      reviews: [
        { rating: 5, comment: 'Très professionnelle, m\'a sauvé la mise !', user_name: 'Thomas B.' },
        { rating: 5, comment: 'Disponible rapidement, parfait.', user_name: 'Sarah M.' }
      ]
    };
    res.json({ success: true, lawyer });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour les villes de l'avocat
router.patch('/cities', authMiddleware, async (req, res) => {
  try {
    const { cities, is_available } = req.body;
    if (req.user.type !== 'lawyer')
      return res.status(403).json({ error: 'Réservé aux avocats' });
    if (!Array.isArray(cities) || cities.length === 0)
      return res.status(400).json({ error: 'Au moins une ville requise' });

    // En production : UPDATE lawyers SET cities=$1, is_available=$2 WHERE id=$3
    res.json({ success: true, cities, is_available, message: 'Villes mises à jour' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
