import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import Billing from './Billing';
import Profile from './Profile';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Paper sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="Settings tabs"
          >
            <Tab label="Profile" id="settings-tab-0" />
            <Tab label="Billing" id="settings-tab-1" />
            <Tab label="Notifications" id="settings-tab-2" />
            <Tab label="Security" id="settings-tab-3" />
          </Tabs>
        </Box>
        
        <TabPanel value={value} index={0}>
          <Profile />
        </TabPanel>
        
        <TabPanel value={value} index={1}>
          <Billing />
        </TabPanel>
        
        <TabPanel value={value} index={2}>
          Notification settings go here
        </TabPanel>
        
        <TabPanel value={value} index={3}>
          Security settings go here
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Settings;
