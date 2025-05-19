import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { styled } from '@mui/system';

const Banner = styled('div')({
  backgroundImage: 'url("/promo-banner.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#FFFFFF',
  fontSize: '36px',
  fontWeight: 'bold',
});

const PromoCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.03)',
  },
  '& h2': {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  '& p': {
    fontSize: '16px',
    color: theme.palette.text.secondary,
  },
  '& button': {
    backgroundColor: '#1B374C',
    color: '#FFFFFF',
    fontSize: '16px',
    padding: '12px 24px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#1E556B',
    },
  },
}));

const PromoPage = () => {
  return (
    <Box sx={{ fontFamily: 'Fira Sans', backgroundColor: '#F5F5F6', p: 4 }}>
      <Banner>
        <Typography variant="h3">Promotion Limitée!</Typography>
      </Banner>
      <Grid container spacing={4} justifyContent="center" mt={4}>
        <Grid item xs={12} md={6}>
          <PromoCard>
            <Typography variant="h2">Découvrez la collection</Typography>
            <Typography variant="body1">
              Explorons de nouveaux chefs-d'œuvre de la collection.
            </Typography>
            <Button variant="contained">Voir plus</Button>
          </PromoCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <PromoCard>
            <Typography variant="h2">Réduction exclusive</Typography>
            <Typography variant="body1">
              Profitez d'une réduction exclusive sur vos prochaines achats.
            </Typography>
            <Button variant="contained">S'inscrire</Button>
          </PromoCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PromoPage;