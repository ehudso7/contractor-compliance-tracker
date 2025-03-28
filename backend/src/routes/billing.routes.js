const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createCheckoutSession,
  handleWebhook,
  cancelSubscription,
} = require('../controllers/stripe.controller');

const router = express.Router();

// Special middleware for Stripe webhooks to get raw body
const stripeWebhookMiddleware = express.raw({
  type: 'application/json',
});

// Routes
router.post(
  '/create-checkout-session',
  protect,
  authorize('admin', 'manager'),
  createCheckoutSession
);

router.post('/webhook', stripeWebhookMiddleware, handleWebhook);

router.post(
  '/cancel-subscription',
  protect,
  authorize('admin', 'manager'),
  cancelSubscription
);

module.exports = router;
