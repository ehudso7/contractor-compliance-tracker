const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Company = require('../models/Company');

exports.createCheckoutSession = async (companyId, plan, userId) => {
  const company = await Company.findById(companyId);
  
  if (!company) {
    throw new Error('Company not found');
  }
  
  // Create or retrieve Stripe customer
  let customerId = company.subscription.stripeCustomerId;
  
  if (!customerId) {
    // Get user email
    const User = require('../models/User');
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create new customer in Stripe
    const customer = await stripe.customers.create({
      email: user.email,
      name: company.name,
      metadata: {
        companyId: company._id.toString()
      }
    });
    
    customerId = customer.id;
    
    // Save customer ID to company
    company.subscription.stripeCustomerId = customerId;
    await company.save();
  }
  
  // Define prices based on plan
  const prices = {
    basic: process.env.STRIPE_BASIC_PRICE_ID,
    premium: process.env.STRIPE_PREMIUM_PRICE_ID,
    enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
  };
  
  if (!prices[plan]) {
    throw new Error('Invalid subscription plan');
  }
  
  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: prices[plan],
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/settings/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/settings/billing`,
    metadata: {
      companyId: company._id.toString(),
      plan,
    },
  });
  
  return session;
};

// Handle subscription updated event
exports.handleSubscriptionUpdated = async (subscription) => {
  // Get company ID from metadata
  const companyId = subscription.metadata.companyId;
  
  if (!companyId) {
    console.error('No company ID found in subscription metadata');
    return;
  }
  
  const company = await Company.findById(companyId);
  
  if (!company) {
    console.error(`Company not found for ID: ${companyId}`);
    return;
  }
  
  // Update company subscription details
  company.subscription = {
    ...company.subscription,
    plan: subscription.metadata.plan || company.subscription.plan,
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  };
  
  await company.save();
  
  console.log(`Updated subscription for company: ${company.name}`);
};

// Cancel subscription
exports.cancelSubscription = async (companyId) => {
  const company = await Company.findById(companyId);
  
  if (!company || !company.subscription.stripeSubscriptionId) {
    throw new Error('Subscription not found');
  }
  
  // Cancel at period end to allow access until current billing period ends
  await stripe.subscriptions.update(company.subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });
  
  // Update company record
  company.subscription.status = 'canceling';
  await company.save();
  
  return { success: true };
};
