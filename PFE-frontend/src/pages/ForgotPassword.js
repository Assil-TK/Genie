import React, { useState } from 'react';
import {Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <Box sx={{
      backgroundImage: "url('/assets/images/background.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Card sx={{ width: 400, padding: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, textAlign: "center", color: "#F39325", fontWeight: 'bold' }}>
            Réinitialisation du mot de passe
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Adresse email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#1B374C",
                color: "#FFF",
                borderRadius: 2,
                height: "40px"
              }}
            >
              Envoyer le lien de réinitialisation
            </Button>
          </form>

          {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
