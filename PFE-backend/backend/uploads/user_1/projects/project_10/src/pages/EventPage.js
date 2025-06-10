import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const EventPage = () => {
  return (
    <Card sx={{ maxWidth: 300, margin: '0 auto', marginTop: 5 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Vendredi 13 juin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Soutenance de PFE
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EventPage;