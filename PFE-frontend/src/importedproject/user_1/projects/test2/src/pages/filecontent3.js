import * as React from 'react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const StyledDiv = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#FDF5E6', // Light pink for light mode, dark grey for dark mode
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const RedButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF5733', // Tomato red
  '&:hover': {
    backgroundColor: '#E53935',
  },
}));

const PinkBackgroundContainer = () => {
  return (
    <StyledDiv>
      <CssBaseline />
      <RedButton variant="contained" color="inherit">
        Hello, Red Button
      </RedButton>
      <Typography variant="h1" component="h1" gutterBottom>
        Pink Background Page
      </Typography>
      <Typography variant="body1" component="p">
        This is a modern UI with a pink background.
      </Typography>
    </StyledDiv>
  );
};

export default PinkBackgroundContainer;