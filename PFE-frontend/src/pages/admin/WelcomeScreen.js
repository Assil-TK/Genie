/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import { Box, Fade, Button, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import gifAnimation from '../../assets/yesfull222.gif';


// Background animation
const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Entrance animation from left
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

// Entrance animation from bottom
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

  useEffect(() => {
    const originalBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#f0f9ff';
    return () => {
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, md: 10 },
          background: 'linear-gradient(-45deg, #1e3c72, #2a5298, #a5c5ff, #3b6dca)',
          backgroundSize: '400% 400%',
          animation: `${gradientMove} 25s ease infinite`,
          fontFamily: 'Poppins, sans-serif',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Watermark background */}
        <Box
          component="img"
          src="public/images/webdevelopment-.png"
          alt="background watermark"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.025,
            zIndex: -1,
          }}
        />

        {/* Animated blob SVG */}
        <Box
          component="svg"
          viewBox="0 0 800 600"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200%',
            height: '200%',
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
            opacity: 0.12,
          }}
        >
          <path fill="white">
            <animate
              attributeName="d"
              dur="15s"
              repeatCount="indefinite"
              values="
                M421.5 115.5C508.5 145 637 184.5 645.5 263.5C654 342.5 542 384.5 468 439.5C394 494.5 357.5 572.5 287.5 563.5C217.5 554.5 169.5 458.5 134.5 375C99.5 291.5 77.5 221.5 123.5 163C169.5 104.5 334.5 86 421.5 115.5Z;
                M400 140C480 160 620 190 630 270C640 350 530 390 450 450C370 510 340 580 270 570C200 560 150 470 120 390C90 310 60 230 110 160C160 90 320 120 400 140Z;
                M421.5 115.5C508.5 145 637 184.5 645.5 263.5C654 342.5 542 384.5 468 439.5C394 494.5 357.5 572.5 287.5 563.5C217.5 554.5 169.5 458.5 134.5 375C99.5 291.5 77.5 221.5 123.5 163C169.5 104.5 334.5 86 421.5 115.5Z
              "
            />
          </path>
        </Box>

        {/* LEFT: Text & Button */}
        <Box
          sx={{
            zIndex: 2,
            maxWidth: '50%',
            textAlign: 'left',
            ml: { xs: 2, md: 8 },
          }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              mb: 2,
              animation: `${slideFadeIn} 0.8s ease forwards`,
              animationDelay: '0.2s',
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
              opacity: 0,
              color: '#ffcb74',
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
                backgroundColor: '#ff8c42',
                color: '#fff',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#ffae64',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Commencer
            </Button>
          </Box>
        </Box>

        {/* RIGHT: Empty space */}
        <Box
  sx={{
    width: '45%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  }}
>
  <img
    src={gifAnimation}
    alt="Animated Visual"
    style={{ width: '100%', maxWidth: '560px', height: 'auto', marginTop:'40px',filter: 'drop-shadow(0 0 12px rgba(223, 215, 211, 0.4))', }}
  />
</Box>

      </Box>
    </Fade>
  );
};

export default WelcomeScreen;

