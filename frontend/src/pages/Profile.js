import React from 'react';
import { Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  
  // In a real implementation, this would use a form library like Formik
  const [formValues, setFormValues] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would call an API to update the user profile
    alert('Profile update functionality would be implemented here');
  };
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Profile Settings
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                required
                disabled // Email changes would typically require verification
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ mt: 2 }}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Profile;
