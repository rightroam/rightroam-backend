const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_demo');
const { authMiddleware } = require('../middleware/auth');

const PLANS = {
  per_trip:  { amount: 199,  currency: 'eur', name: 'Pass Voyage RightRoam' },
  monthly:   { amount: 399,  currency: 'eur', name: 'Pass Mensuel RightRoam' },
  annual:    { amount: 2999, currency: 'eur', name: 'Pass Annuel RightRoam' },
};

// ── STRIPE ──

// Créer un PaymentIntent Stripe
router.post('/stripe/create-intent', authMiddleware, async (req, res) => {
  try {
    const { plan_type } = req.body;
    const plan = PLANS[plan_type];
    if (!plan) return res.status(400).json({ error: 'Plan invalide' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: plan.amount,
      currency: plan.currency,
      metadata: { user_id: req.user.id, plan_type },
      description: plan.name,
    });

    res.json({ success: true, client_secret: paymentIntent.client_secret, amount: plan.amount });
  } catch (err) {
    res.status(500).json({ error: 'Erreur Stripe', details: err.message });
  }
});

// Webhook Stripe (confirmer le paiement)
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).json({ error: 'Webhook invalide' });
  }

  if (event.type === 'payment_intent.succeeded') {
    const { user_id, plan_type } = event.data.object.metadata;
    // En production : INSERT INTO subscriptions + INSERT INTO payments
    console.log(`Paiement confirmé pour utilisateur ${user_id}, plan ${plan_type}`);
  }
  res.json({ received: true });
});

// ── PAYPAL ──

// Créer un ordre PayPal
router.post('/paypal/create-order', authMiddleware, async (req, res) => {
  try {
    const { plan_type } = req.body;
    const plan = PLANS[plan_type];
    if (!plan) return res.status(400).json({ error: 'Plan invalide' });

    const amount = (plan.amount / 100).toFixed(2);

    // Obtenir le token d'accès PayPal
    const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const { access_token } = await tokenRes.json();

    // Créer l'ordre
    const orderRes = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: 'EUR', value: amount },
          description: plan.name,
        }],
        application_context: {
          return_url: `${process.env.APP_URL}/payment/success`,
          cancel_url: `${process.env.APP_URL}/payment/cancel`,
        },
      }),
    });
    const order = await orderRes.json();
    res.json({ success: true, order_id: order.id, approve_url: order.links?.find(l => l.rel === 'approve')?.href });
  } catch (err) {
    res.status(500).json({ error: 'Erreur PayPal', details: err.message });
  }
});

// Capturer un paiement PayPal
router.post('/paypal/capture/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    // En production : appel PayPal capture + INSERT INTO payments
    res.json({ success: true, message: 'Paiement PayPal confirmé', order_id: orderId });
  } catch (err) {
    res.status(500).json({ error: 'Erreur PayPal' });
  }
});

// Prix des plans (public)
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    plans: [
      { type: 'per_trip', name: 'Pass Voyage', price: 1.99, currency: 'EUR', description: 'Par voyage, sans engagement' },
      { type: 'monthly',  name: 'Pass Mensuel', price: 3.99, currency: 'EUR', description: 'Par mois, voyageur fréquent' },
      { type: 'annual',   name: 'Pass Annuel',  price: 29.99, currency: 'EUR', description: 'Par an, digital nomad' },
    ]
  });
});

module.exports = router;
