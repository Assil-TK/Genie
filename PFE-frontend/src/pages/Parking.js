import React from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';

const Parking = () => (
  <Container style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="md" sx={{ textAlign: 'center', color: '#1B374C', fontFamily: 'Fira Sans' }}>
        <Typography variant="h1" sx={{ mb: 2 }}>EFFIA</Typography>
        <Typography variant="h1" sx={{ mb: 2 }}>Belgique</Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>Empowering your growth with innovative solutions.</Typography>
        <Button variant="contained" color="warning" sx={{ mt: 2 }}>Let's go</Button>
      </Container>
    </Box>
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={3}>
        <Card sx={{ maxWidth: 200, background: '#F5F5F6' }}>
          <CardMedia component="img" image="bruxelle.jpg" height="140" />
          <CardContent>
            <Typography gutterBottom variant="h5">Bruxelle</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card sx={{ maxWidth: 200, background: '#F5F5F6' }}>
          <CardMedia component="img" image="liege.jpg" height="140" />
          <CardContent>
            <Typography gutterBottom variant="h5">Liège</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card sx={{ maxWidth: 200, background: '#F5F5F6' }}>
          <CardMedia component="img" image="ln.jpg" height="140" />
          <CardContent>
            <Typography gutterBottom variant="h5">LN</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card sx={{ maxWidth: 200, background: '#F5F5F6' }}>
          <CardMedia component="img" image="vervier.jpg" height="140" />
          <CardContent>
            <Typography gutterBottom variant="h5">Vervier</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    <Box sx={{ background: 'rgba(255, 255, 255, 0.8)', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="md" sx={{ textAlign: 'center', color: '#1B374C', fontFamily: 'Fira Sans' }}>
        <Typography variant="subtitle1">Contact us:</Typography>
        <Typography variant="body2">XXX-XXX-XXXX</Typography>
        <Typography variant="body2">effia@example.com</Typography>
      </Container>
    </Box>
  </Container>
);

export default Parking;