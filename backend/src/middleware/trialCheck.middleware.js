const Company = require('../models/Company');

exports.checkTrialStatus = async (req, res, next) => {
  // Skip if not authenticated
  if (!req.user) {
    return next();
  }
  
  // If no company or admin user, skip
  if (!req.user.company || req.user.role === 'admin') {
    return next();
  }
  
  try {
    const company = await Company.findById(req.user.company);
    
    if (!company) {
      return next();
    }
    
    // If trial expired and no active subscription
    if (
      company.subscription.plan === 'trial' && 
      company.isTrialExpired() && 
      !company.subscription.stripeSubscriptionId
    ) {
      // Add trial expired flag to request
      req.trialExpired = true;
    }
    
    next();
  } catch (err) {
    console.error('Error checking trial status:', err);
    next();
  }
};
