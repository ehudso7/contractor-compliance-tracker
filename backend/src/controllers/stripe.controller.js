const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripeService = require('../services/stripe.service');

// Create checkout session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;
    const companyId = req.user.company;
    
    const session = await stripeService.createCheckoutSession(companyId, plan, req.user.id);
    
    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error creating checkout session',
    });
  }
};

// Handle webhook events
exports.handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Handle successful checkout
        console.log('Checkout completed for:', session.client_reference_id);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await stripeService.handleSubscriptionUpdated(subscription);
        break;
      
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        // Handle subscription cancellation
        console.log('Subscription deleted:', deletedSubscription.id);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const companyId = req.user.company;
    
    const result = await stripeService.cancelSubscription(companyId);
    
    res.status(200).json({
      success: true,
      message: 'Subscription will be canceled at the end of the current billing period',
    });
  } catch (err) {
    console.error('Error canceling subscription:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error canceling subscription',
    });
  }
};
