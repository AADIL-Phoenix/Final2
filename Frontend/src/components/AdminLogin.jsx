import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Link, 
  IconButton, DialogTitle, DialogContent, Alert 
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const AdminLogin = ({ setUser, switchToSignup, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get selected admin from localStorage
    const selectedAdmin = JSON.parse(localStorage.getItem('selectedAdmin'));
    
    if (email && password && selectedAdmin) {
      // Set user with actual admin data
      setUser({
        name: selectedAdmin.name,
        email: selectedAdmin.email,
        role: selectedAdmin.role,
        avatar: selectedAdmin.avatar,
        initials: selectedAdmin.avatar,
        userId: selectedAdmin.userId
      });
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify({
        name: selectedAdmin.name,
        email: selectedAdmin.email,
        role: selectedAdmin.role,
        avatar: selectedAdmin.avatar,
        initials: selectedAdmin.avatar,
        userId: selectedAdmin.userId
      }));
      
      onClose();
    } else {
      setError('Please fill in all fields and select an admin');
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
        <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
          Admin Login
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
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
              Member Signup
            </Link>
          </Typography>
        </form>
      </DialogContent>
    </>
  );
};

export default AdminLogin;