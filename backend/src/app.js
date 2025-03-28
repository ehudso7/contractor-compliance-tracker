const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const billingRoutes = require('./routes/billing.routes');
const { checkTrialStatus } = require('./middleware/trialCheck.middleware');

// Initialize express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add raw body for Stripe webhooks
app.use((req, res, next) => {
  if (req.originalUrl === '/api/billing/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/billing', billingRoutes);

// Apply trial check middleware after auth middleware
app.use(checkTrialStatus);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
