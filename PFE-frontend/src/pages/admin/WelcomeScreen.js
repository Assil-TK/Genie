/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import { Box, Typography, Button, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';

// Background animation
const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Text animation
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const WelcomeScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set light blue background on body only for this page
    const originalBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#a5d8ff';

    // Optional: Remove margin if not already done globally
    document.body.style.margin = '0';

    return () => {
      // Clean up when navigating away
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);

  const handleStart = () => {
    navigate('/login');
  };

  return (
    <Fade in={true} timeout={1000}>
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          m: 0,
          p: 0,
          background: 'linear-gradient(-45deg, #1e3c72, #2a5298, #74b0c0, #3b6dca)',
          backgroundSize: '400% 400%',
          animation: `${gradientMove} 15s ease infinite`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: 4,
            width: '100%',
            maxWidth: '800px',
          }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{
              animation: `${fadeInUp} 1s ease forwards`,
              animationDelay: '0.3s',
              opacity: 0,
            }}
          >
            Welcome to
          </Typography>

          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{
              mb: 6,
              animation: `${fadeInUp} 1s ease forwards`,
              animationDelay: '0.6s',
              opacity: 0,
            }}
          >
            NomDeVotreApp
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0,
              animation: `${fadeInUp} 1s ease forwards`,
              animationDelay: '0.9s',
            }}
          >
            Une nouvelle façon de gérer vos projets Web avec l'IA
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              mt: -3,
              opacity: 0,
              animation: `${fadeInUp} 1s ease forwards`,
              animationDelay: '1.2s',
            }}
          >
            Ajoutez, Modifiez, Déployez. Plus vite que jamais.
          </Typography>

          <Box
            sx={{
              mt: 4,
              opacity: 0,
              animation: `${fadeInUp} 1s ease forwards`,
              animationDelay: '1.5s',
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleStart}
              sx={{
                px: 5,
                py: 1.8,
                backgroundColor: '#f39325', 
                fontSize: '1.1rem',
                borderRadius: '30px',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',

              }}
            >
              COMMENCER
            </Button>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default WelcomeScreen;
