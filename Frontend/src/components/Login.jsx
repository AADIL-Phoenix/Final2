import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert, Link
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ( { setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // URL: /login?role=admin OR /login?role=member
  const isAdmin = new URLSearchParams(location.search).get("role") === "admin";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });

      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('selectedAdmin');
      setUser(user);
      navigate('/');


    } catch (err) {
      setError('Invalid credentials or user not found', err);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={10} p={4} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2} fontWeight={600} textAlign="center">
        {isAdmin ? 'Admin Login' : 'Member Login'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, bgcolor: '#6b5ce7', '&:hover': { bgcolor: '#5a4bd0' } }}
        >
          Login
        </Button>
      </form>

      {/* Register option only for Admin */}
      {isAdmin && (
        <Typography variant="body2" textAlign="center" mt={2}>
          First time?{' '}
          <Link
            component="button"
            onClick={() => navigate('/register-admin')}
            fontWeight={600}
          >
            Register as Admin
          </Link>
        </Typography>
      )}
    </Box>
  );
};

export default LoginPage;
