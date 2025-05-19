import React from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h2" gutterBottom>
          Bienvenue sur notre site
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Découvrez nos services, notre équipe, et les avantages que nous vous proposons.
        </Typography>
        <Button variant="contained" size="large" color="primary">
          En savoir plus
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mt: 5 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5">Service 1</Typography>
            <Typography variant="body2" color="text.secondary">
              Description du premier service proposé avec des détails intéressants.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5">Service 2</Typography>
            <Typography variant="body2" color="text.secondary">
              Un deuxième service tout aussi impressionnant.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5">Service 3</Typography>
            <Typography variant="body2" color="text.secondary">
              Encore un service, pour répondre à tous vos besoins.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5">Service 4</Typography>
            <Typography variant="body2" color="text.secondary">
              Encore un service pour répondre à vos besoins.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;