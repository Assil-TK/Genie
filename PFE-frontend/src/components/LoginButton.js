import React from 'react';
import { Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const LoginButton = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5010/auth/github';
  };

  return (
    <Button
      variant="contained"
      startIcon={<GitHubIcon />}
      onClick={handleLogin}
      fullWidth
      sx={{
        mt: 1,
        backgroundColor: '#1B374C',
        color: '#FFF',
        height: '45px',
        borderRadius: 2,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#10222f',
        },
      }}
    >
      SE CONNECTER AVEC GITHUB
    </Button>
  );
};

export default LoginButton;
