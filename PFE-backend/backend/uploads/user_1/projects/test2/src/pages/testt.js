import React from 'react';
import Typography from '@mui/material/Typography';

const HelloWorldPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography variant="h1" component="div">
        Hello World
      </Typography>
    </div>
  );
};

export default HelloWorldPage;