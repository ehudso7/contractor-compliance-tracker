const User = require('../models/User');
const Company = require('../models/Company');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role, companyName } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // If user is not an admin, create or associate company
    let company;
    if (role !== 'admin') {
      if (!companyName) {
        return res.status(400).json({
          success: false,
          message: 'Company name is required for non-admin users',
        });
      }

      // Try to find the company first
      company = await Company.findOne({ name: companyName });

      // If company doesn't exist, create it
      if (!company) {
        company = await Company.create({
          name: companyName,
          subscription: {
            plan: 'trial',
            status: 'trialing',
            trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
          },
        });
      }
    }

    // Create user
    user = new User({
      name,
      email,
      password,
      role,
      company: company ? company._id : null,
    });

    await user.save();

    // Create token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: company ? {
          id: company._id,
          name: company.name,
        } : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Get company info if applicable
    let company = null;
    if (user.company) {
      company = await Company.findById(user.company);
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: company ? {
          id: company._id,
          name: company.name,
          subscription: company.subscription,
        } : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get company info if applicable
    let company = null;
    if (user.company) {
      company = await Company.findById(user.company);
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: company ? {
          id: company._id,
          name: company.name,
          subscription: company.subscription,
        } : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
