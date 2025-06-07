/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { Box, Fade, Button, Typography } from '@mui/material';
import { keyframes, css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import gifAnimation from '../../assets/orangee.gif';
import staticImage from '../../assets/orangee.png';

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatMotion = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(-3px, 5px); }
  50% { transform: translate(3px, -5px); }
  75% { transform: translate(-2px, 4px); }
  100% { transform: translate(0, 0); }
`;


const slideFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideUpFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [showGif, setShowGif] = useState(true);

  useEffect(() => {
    const originalBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#f0f9ff';

    const timer = setTimeout(() => setShowGif(false), 4900);

    return () => {
      document.body.style.backgroundColor = originalBackground;
      clearTimeout(timer);
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, md: 10 },
          background: 'linear-gradient(-45deg, #1e3c72,rgb(24, 51, 98),rgb(77, 110, 170),rgb(24, 61, 102))',
          backgroundSize: '400% 400%',
          animation: `${gradientMove} 25s ease infinite`,
          fontFamily: 'Poppins, sans-serif',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            zIndex: 2,
            marginTop: -4,
            maxWidth: '50%',
            textAlign: 'left',
            ml: { xs: 2, md: 10 },
          }}
        >
          <Typography
            variant="h2"
            fontWeight={700}
            sx={{
              mb: 2,
              fontSize: '4.5rem' ,
              animation: `${slideFadeIn} 0.8s ease forwards`,
              animationDelay: '0.2s',
              textShadow: '2px 2px 6px rgba(0, 0, 0, 0.5)',
              opacity: 0,
            }}
          >
            Bienvenue sur
          </Typography>

          <Typography
            variant="h2"
            fontWeight={700}
            sx={{
              mb: 3,
              animation: `${slideFadeIn} 1.2s ease forwards`,
              animationDelay: '0.8s',
              textShadow: '2px 2px 6px rgba(0, 0, 0, 0.5)',
              opacity: 0,
              color: 'rgb(238, 210, 89)',
            }}
          >
            GenieAI
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 500,
              letterSpacing: '0.5px',
              fontSize: '1.15rem',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
              animation: `${slideUpFadeIn} 0.8s ease forwards`,
              animationDelay: '2s',
              opacity: 0,
            }}
          >
            Une nouvelle façon de gérer vos projets Web avec l'IA
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 5,
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 500,
              letterSpacing: '0.5px',
              fontSize: '1.15rem',
              animation: `${slideUpFadeIn} 0.8s ease forwards`,
              animationDelay: '2.4s',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
              opacity: 0,
            }}
          >
            Ajoutez, Modifiez, Déployez. Plus vite que jamais.
          </Typography>

          <Box
            sx={{
              animation: `${slideUpFadeIn} 0.8s ease forwards`,
              animationDelay: '3s',
              opacity: 0,
            }}
          >
            <Button
              onClick={handleStart}
              sx={{
                px: 5,
                py: 1.8,
                fontSize: '1.1rem',
                borderRadius: '30px',
                fontWeight: 'bold',
                backgroundColor: ' #00d544',
                color: '#fff',
                textTransform: 'none',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgb(6, 164, 56)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              COMMENCER
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: '45%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <img
  src={showGif ? gifAnimation : staticImage}
  alt="Visual"
  css={css`
    width: 110%;
    max-width: 560px;
    height: auto;
    margin-top: -1px;
    filter: drop-shadow(0 0 12px rgba(42, 46, 68, 0.52));
    transition: opacity 0.5s ease-in-out;
    ${!showGif &&
    css`
      animation: ${floatMotion} 7s ease-in-out infinite;
    `}
  `}
/>


        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '120px',
            zIndex: 1,
            overflow: 'hidden',
            lineHeight: 0,
          }}
        >
          <svg
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            <path
              d="M0.00,49.98 C150.00,150.00 349.91,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
              style={{
                stroke: 'none',
                fill: 'rgba(255,255,255,0.1)',
              }}
            />
          </svg>
        </Box>
      </Box>
    </Fade>
  );
};

export default WelcomeScreen;
