import React from 'react';
import { Button, Container, Typography } from '@mui/material';

const EventPage = () => {

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#F5F5F6', fontFamily: "'Fira Sans', sans-serif" }}>
      <Typography variant="h1" color="#1B374C" sx={{ mb: 2 }}>
        EFFIA Tour de Ville avec Vélo
      </Typography>
      <Typography variant="subtitle1" color="#1B374C" sx={{ mb: 4 }}>
        Organisé par EFFIA le 2025-05-01 à Bruxelles
      </Typography>
      <Typography variant="body1" color="#1B374C" sx={{ mb: 2, maxWidth: '80%' }}>
        Rejoignez-nous pour une journée libre de stress en faisant du vélo à travers la magnifique ville de Bruxelles. 
        Des erosifs promettent une excursion touristique intéressante à travers les parcs et les rues pittoresques de la ville. 
        L'accès est gratuit.
      </Typography>
      <Button variant="contained" color="primary" sx={{ backgroundColor: '#F39325', color: '#FFFFFF', fontWeight: 'bold', bp: 2 }}>
        Inscription
      </Button>
    </Container>
  );
};

export default EventPage;