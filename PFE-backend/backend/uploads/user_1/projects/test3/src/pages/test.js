import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const PromoPage = () => {
  return (
    <Box style={{ backgroundColor: '#F5F5F6', padding: '20px' }}>
      <Grid container spacing={3} justify="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} md={8} style={{ textAlign: 'center' }}>
          <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
            <Typography variant="h4" color="#1B374C" style={{ fontFamily: 'Fira Sans', marginBottom: '20px' }}>
              Découvrez nos réductions sur nos produits
            </Typography>
            <Typography variant="subtitle1" color="#555555" style={{ fontFamily: 'Fira Sans', marginBottom: '20px' }}>
              Profitez de nos meilleurs offres avec des réductions sur de nombreux produits.
            </Typography>
            <Button variant="contained" color="primary" style={{ backgroundColor: '#1B374C', fontFamily: 'Fira Sans' }}>
              Consulter notre catalogue
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PromoPage;