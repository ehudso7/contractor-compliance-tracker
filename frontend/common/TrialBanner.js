import React from 'react';
import { Alert, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const TrialBanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if on trial
  const isTrial = user?.company?.subscription?.plan === 'trial';
  
  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!user?.company?.subscription?.trialEndDate) return 0;
    
    const trialEnd = new Date(user.company.subscription.trialEndDate);
    const today = new Date();
    const diffTime = trialEnd - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  const daysRemaining = calculateDaysRemaining();
  
  // Don't show banner if not on trial
  if (!isTrial) return null;
  
  // Show expired message if trial ended
  if (daysRemaining === 0) {
    return (
      <Alert 
        severity="error"
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={() => navigate('/settings/billing')}
          >
            Subscribe Now
          </Button>
        }
      >
        Your trial has expired. Please subscribe to continue using all features.
      </Alert>
    );
  }
  
  // Show trial banner with days remaining
  return (
    <Alert 
      severity="info"
      action={
        <Button 
          color="inherit" 
          size="small" 
          onClick={() => navigate('/settings/billing')}
        >
          Subscribe
        </Button>
      }
    >
      {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining in your trial.
    </Alert>
  );
};

export default TrialBanner;
