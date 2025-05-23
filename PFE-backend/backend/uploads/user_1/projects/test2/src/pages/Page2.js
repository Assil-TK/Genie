import React from 'react';
import { Box, Typography } from '@mui/material';

const HomePage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#F5F5F6',
      }}
    >
      <Typography
        variant="h1"
        color="#1B374C"
        fontSize={24}
        fontFamily="'Fira Sans', sans-serif"
      >
        Hello Assil
      </Typography>
    </Box>
  );
};

export default HomePage;