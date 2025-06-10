import React from 'react';
import { Box, Typography } from '@mui/material';

const HelloPage = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" sx={{ backgroundColor: '#f0f8ff' }}>
      <Typography variant="h4" color="#333">
        Hello, World!
      </Typography>
    </Box>
  );
};

export default HelloPage;