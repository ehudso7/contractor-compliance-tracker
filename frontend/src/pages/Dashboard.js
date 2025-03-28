import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const company = user?.company;
  const subscription = company?.subscription;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">
          Welcome, {user?.name}!
        </Typography>
        
        {company && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Company: {company.name}
          </Typography>
        )}
        
        {subscription && (
          <>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Subscription Plan: {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
            </Typography>
            
            {subscription.plan === 'trial' && subscription.trialEndDate && (
              <Typography variant="body1" sx={{ mt: 1 }}>
                Trial ends on: {new Date(subscription.trialEndDate).toLocaleDateString()}
              </Typography>
            )}
            
            {subscription.plan !== 'trial' && subscription.currentPeriodEnd && (
              <Typography variant="body1" sx={{ mt: 1 }}>
                Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </Typography>
            )}
          </>
        )}
      </Box>
      
      {/* More dashboard content will go here */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">
          Quick Stats
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          This is a placeholder for dashboard statistics and charts. In a complete implementation, 
          this would show contractor counts, document status, upcoming expirations, etc.
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
