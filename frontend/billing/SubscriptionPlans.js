import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const plans = [
  {
    id: 'trial',
    name: 'Trial',
    price: 'Free',
    period: '14 days',
    features: [
      'Full access to Premium features',
      'Up to 25 contractors',
      'Email notifications',
      'Document management',
      'No credit card required',
    ],
    buttonText: 'Current Plan',
    disabled: true,
    color: 'default',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '$49',
    period: 'per month',
    features: [
      'Up to 25 contractors',
      'Full compliance tracking',
      'Email notifications for expiring documents',
      'Document uploads and management',
      'Basic analytics',
    ],
    buttonText: 'Subscribe',
    color: 'primary',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$99',
    period: 'per month',
    features: [
      'Up to 100 contractors',
      'All Basic features',
      'Compliance analytics and reports',
      'Contractor portal',
      'API access',
      'Priority support',
    ],
    buttonText: 'Subscribe',
    color: 'primary',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$199+',
    period: 'per month',
    features: [
      'Unlimited contractors',
      'All Premium features',
      'Custom compliance requirements',
      'Priority support',
      'Custom integrations',
      'Dedicated account manager',
    ],
    buttonText: 'Contact Us',
    color: 'secondary',
  },
];

const SubscriptionPlans = () => {
  const { user } = useAuth();
  const currentPlan = user?.company?.subscription?.plan || 'trial';

  const handleSubscribe = async (planId) => {
    if (planId === 'enterprise') {
      // Open contact form or redirect to contact page
      window.location.href = '/contact';
      return;
    }

    try {
      const response = await api.post('/billing/create-checkout-session', {
        plan: planId,
      });

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again later.');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Subscription Plans
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {plans.map((plan) => (
          <Grid item xs={12} md={6} lg={3} key={plan.id}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderTop:
                  currentPlan === plan.id ? '4px solid #2196f3' : 'none',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color={currentPlan === plan.id ? 'primary' : 'textPrimary'}
                >
                  {plan.name}
                  {currentPlan === plan.id && ' (Current)'}
                </Typography>
                <Typography
                  variant="h4"
                  component="p"
                  color="text.primary"
                  sx={{ mb: 1 }}
                >
                  {plan.price}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {plan.period}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color={plan.color}
                  disabled={currentPlan === plan.id || plan.disabled}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {currentPlan === plan.id ? 'Current Plan' : plan.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SubscriptionPlans;
