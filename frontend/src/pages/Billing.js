import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import SubscriptionPlans from '../components/billing/SubscriptionPlans';
import BillingSettings from '../components/billing/BillingSettings';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`billing-tabpanel-${index}`}
      aria-labelledby={`billing-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Billing = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Subscription & Billing
      </Typography>
      
      <Paper sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="Billing tabs"
          >
            <Tab label="Plans" id="billing-tab-0" />
            <Tab label="Settings" id="billing-tab-1" />
          </Tabs>
        </Box>
        
        <TabPanel value={value} index={0}>
          <SubscriptionPlans />
        </TabPanel>
        
        <TabPanel value={value} index={1}>
          <BillingSettings />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Billing;
