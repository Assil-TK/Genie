import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import screenshot from '../assets/Screenshot 2025-06-04 141620.png';

const EventPage = () => {
  return (
    <div>
      <img src={screenshot} alt="Screenshot" style={{ width: '100%', height: 'auto' }} />
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
    </div>
  );
};

export default EventPage;