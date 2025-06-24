import React from 'react';
import { Box, TextField, Button, Typography, Link, IconButton, DialogTitle, DialogContent } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const AdminLogin = ({ setUser, switchToSignup, onClose, selectedAdmin }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    if (selectedAdmin == 'Alex Morgan' && 
        email == 'alex.morgan@taskflowpro.com' && 
        password == 'admin123') {
      setUser({
        name: 'Alex Morgan',
        initials: 'AM'
      });
      
      onClose();
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <>
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
          Admin Login
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email Address"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button 
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, bgcolor: '#6b5ce7', '&:hover': { bgcolor: '#5a4bd0' } }}
        >
          Login
        </Button>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link 
            component="button" 
            variant="body2"
            onClick={switchToSignup}
            sx={{ fontWeight: 600 }}
          >
            Create Member Account
          </Link>
        </Typography>
      </form>
      </DialogContent>
    </>
  );
};

export default AdminLogin;
