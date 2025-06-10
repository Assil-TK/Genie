import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const HelloWorld = () => {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
        <Paper elevation={4} sx={{ padding: 2, textAlign: 'center' }}>
          <Box mb={2}>
            <img
              src={require('../assets/Screenshot 2025-06-03 223631.png')}
              alt="Screenshot"
              width={300}
              height={300}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
          <Typography variant="h4" gutterBottom>
            Hello World!
          </Typography>
          <Typography variant="body1">
            This is a modern UI page with a screenshot image.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HelloWorld;
