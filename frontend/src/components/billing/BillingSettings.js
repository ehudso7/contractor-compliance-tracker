import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const BillingSettings = () => {
  const { user } = useAuth();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const subscription = user?.company?.subscription || {
    plan: 'trial',
    status: 'trialing',
  };

  const handleCancelSubscription = async () => {
    try {
      await api.post('/billing/cancel-subscription');
      setCancelSuccess(true);
      setOpenCancelDialog(false);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      setCancelError(
        error.response?.data?.message || 'Failed to cancel subscription'
      );
    }
  };

  // Format plan name for display
  const getPlanDisplay = (planId) => {
    const plans = {
      trial: 'Trial',
      basic: 'Basic',
      premium: 'Premium',
      enterprise: 'Enterprise',
    };
    return plans[planId] || planId;
  };

  // Get next billing date if available
  const getNextBillingDate = () => {
    if (
      subscription.plan === 'trial' ||
      !subscription.currentPeriodEnd
    ) {
      return 'N/A';
    }
    return format(new Date(subscription.currentPeriodEnd), 'MMMM d, yyyy');
  };

  // Get trial end date
  const getTrialEndDate = () => {
    if (
      subscription.plan !== 'trial' ||
      !subscription.trialEndDate
    ) {
      return 'N/A';
    }
    return format(new Date(subscription.trialEndDate), 'MMMM d, yyyy');
  };

  // Check if subscription is active and paid
  const isActivePaidSubscription = () => {
    return (
      subscription.plan !== 'trial' &&
      ['active', 'trialing'].includes(subscription.status)
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Billing Settings
      </Typography>

      {cancelSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Your subscription has been canceled. You will have access until the end
          of your current billing period.
        </Alert>
      )}

      {cancelError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setCancelError(null)}
        >
          {cancelError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Subscription
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Plan:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1">
                    {getPlanDisplay(subscription.plan)}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    variant="body1"
                    sx={{
                      color:
                        subscription.status === 'active'
                          ? 'success.main'
                          : subscription.status === 'canceling'
                          ? 'warning.main'
                          : 'error.main',
                    }}
                  >
                    {subscription.status === 'canceling'
                      ? 'Canceling'
                      : subscription.status?.charAt(0).toUpperCase() +
                        subscription.status?.slice(1) || 'Active'}
                  </Typography>
                </Grid>

                {subscription.plan === 'trial' ? (
                  <>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Trial ends:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">{getTrialEndDate()}</Typography>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Next billing:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">{getNextBillingDate()}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>

              {isActivePaidSubscription() && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setOpenCancelDialog(true)}
                  >
                    Cancel Subscription
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {subscription.plan === 'trial' ? (
                <Typography>No payment method required for Trial</Typography>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Credit Card
                  </Typography>
                  <Typography variant="body1">
                    {/* Display last 4 digits of card if available */}
                    •••• •••• •••• {subscription.lastFour || '####'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expires {subscription.cardExpiry || 'MM/YY'}
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    <Button variant="outlined">Update Payment Method</Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cancellation Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
      >
        <DialogTitle>Cancel Subscription?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your subscription? You will
            continue to have access until the end of your current billing
            period ({getNextBillingDate()}), after which you will be
            downgraded to the Trial plan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>Keep Subscription</Button>
          <Button onClick={handleCancelSubscription} color="error">
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillingSettings;
