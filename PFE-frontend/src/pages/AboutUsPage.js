import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const AboutUsPage = () => {
  const regions = [
    { name: 'Liège', description: 'We have parks in Liège city' },
    { name: 'Bruxelles', description: 'We have parks in Brussels' },
    { name: 'LN', description: 'We have parks in Limburg' },
  ];

  return (
    <Box sx={{ background: '#F5F5F6', padding: '2rem', fontFamily: 'Fira Sans' }}>
      <Typography variant="h4" sx={{ color: '#1B374C', marginBottom: '1rem' }}>
        À propos de nous
      </Typography>
      <Typography variant="body1" sx={{ color: '#1B374C', marginBottom: '2rem' }}>
        Nous sommes Effia, une entreprise dans le domaine de transport en Belgique. Nous possédons plus de 1000 parkings dans plusieurs régions.
      </Typography>
      <Grid container spacing={2}>
        {regions.map(region => (
          <Grid item xs={4} key={region.name}>
            <Card sx={{ background: '#FFFFFF', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#1B374C', fontWeight: 'bold' }}>
                  {region.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#1B374C' }}>
                  {region.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AboutUsPage;