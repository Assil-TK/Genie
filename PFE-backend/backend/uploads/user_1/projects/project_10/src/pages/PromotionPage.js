import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PromotionPage = () => {
  return (
    <Container maxWidth="false" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <Box sx={{ textAlign: 'center', padding: '32px', maxWidth: '600px', borderBottom: '2px solid #007bff' }}>
        <Typography variant="h1" color="#007bff" sx={{ fontWeight: 'bold', mb: 4 }}>
          Promotion Web Développement
        </Typography>
        <Typography variant="body1" color="#333" sx={{ mb: 4 }}>
          Découvrez notre nouveau cycle de formations de web développement !
        </Typography>
        <Typography variant="body1" color="#333" sx={{ mb: 4 }}>
          Formez-vous avec nos experts et devenez le meilleur développeur web du marché.
        </Typography>
      </Box>
    </Container>
  );
};

export default PromotionPage;