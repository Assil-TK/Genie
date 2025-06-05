import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const HelloWorldPage = () => {
  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#F4F6F8',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Hello World
      </Typography>
      <Typography variant="body1" sx={{ color: '#637381' }}>
        Welcome to your first React UI using MUI.
      </Typography>
    </Box>
  );
};

export default HelloWorldPage;