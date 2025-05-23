import React from 'react';
import { Box, Typography } from '@mui/material';

const App = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#F5F5F6',
        fontFamily: 'Fira Sans',
      }}
    >
      <Typography variant="h4" color="#1B374C">
        Hello wooorld
      </Typography>
    </Box>
  );
};

export default App;