const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a company name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description can not be more than 500 characters'],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS',
    ],
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters'],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  subscription: {
    plan: {
      type: String,
      enum: ['trial', 'basic', 'premium', 'enterprise'],
      default: 'trial',
    },
    trialEndDate: {
      type: Date,
      default: function() {
        // Set trial end date to 14 days from now
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 14);
        return trialEnd;
      }
    },
    status: {
      type: String,
      enum: ['trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired'],
      default: 'trialing',
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodEnd: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add method to check if trial is expired
CompanySchema.methods.isTrialExpired = function() {
  if (this.subscription.plan !== 'trial') {
    return false; // Not on trial
  }
  
  return new Date() > this.subscription.trialEndDate;
};

module.exports = mongoose.model('Company', CompanySchema);
