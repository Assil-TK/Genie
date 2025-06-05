import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Fade, keyframes } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
  FileUpload, Add, Edit, FileDownload, CloudUpload, FolderDelete,
  Comment, WorkHistory
} from '@mui/icons-material';
import animation from '../assets/Animation1.gif'; // Import your gif

// Heading animation: fadeInUp
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Scale pop animation (only scale, no opacity)
const popScale = keyframes`
  0% {
    transform: scale(0.85);
  }
  100% {
    transform: scale(1);
  }
`;

const sections = [
  { text: "Importer un projet", icon: <FileUpload />, path: "/admin/upload", color: "#dde6f2" },
  { text: "Création", icon: <Add />, path: "/admin/createFile", color: "#dde6f2" },
  { text: "Modification", icon: <Edit />, path: "/admin/editfile", color: "#dde6f2" },
  { text: "Télécharger", icon: <FileDownload />, path: "/admin/download", color: "#dde6f2" },
  { text: "Deployer", icon: <CloudUpload />, path: "/admin/deploy", color: "#dde6f2" },
  { text: "Supression", icon: <FolderDelete />, path: "/admin/delete", color: "#dde6f2" },
  { text: "Avis", icon: <Comment />, path: "/admin/avis", color: "#dde6f2" },
  { text: "Journal d'activité", icon: <WorkHistory />, path: "/admin/my-history", color: "#dde6f2" },
];

const fadeDuration = 600;
const intervalDelay = 400;

const MenuPage = () => {
  const navigate = useNavigate();
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleItems(prev => {
        if (prev.length < sections.length) {
          return [...prev, sections[prev.length]];
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, intervalDelay);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* Background image */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${animation})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          zIndex: -1,
          opacity: 1,
        }}
      />

      <Header />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 4,
          marginLeft: '100px',
          marginTop: '60px',
          marginRight: '70px',
          transition: 'all 0.3s ease',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontFamily: 'Fira Sans, sans-serif',
            color: 'orange',
            animation: `${fadeInUp} 2s ease-out`,
            textAlign: 'center',
            marginBottom: '60px',
          }}
        >
          Bienvenue sur la plateforme
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {visibleItems.map((item, index) => {
            const delay = index * intervalDelay;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Fade in timeout={fadeDuration} style={{ transitionDelay: `${delay}ms` }} unmountOnExit>
                  <Paper
                    onClick={() => navigate(item.path)}
                    elevation={4}
                    sx={{
                      padding: 3,
                      height: '180px',
                      width: '250px',
                      cursor: 'pointer',
                      backgroundColor: item.color,
                      border: '2px solid #cbd5e0',
                      transition: 'transform 0.3s ease, border-color 0.3s ease',
                      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      fontFamily: 'Poppins',
                      animationName: `${popScale}`,
                      animationDuration: `${fadeDuration}ms`,
                      animationFillMode: 'forwards',
                      animationTimingFunction: 'ease',
                      animationDelay: `${delay}ms`,
                      '&:hover': {
                        transform: 'scale(0.95)', // box shrinks slightly
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        boxShadow: 'none',
                        '& .iconZoom': {
                          transform: 'scale(1.4)', // icon grows
                        },
                      },
                    }}
                  >
                    <Box
                      className="iconZoom"
                      sx={{
                        transition: 'transform 0.3s ease',
                        display: 'flex',
                        
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem', // Adjust as needed
                      }}
                    >
                      {React.cloneElement(item.icon, { fontSize: 'inherit' })}
                    </Box>


                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '1.25rem',
                        color: '#1B374C',
                        textAlign: 'center',
                        marginTop: 1,
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Paper>


                </Fade>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default MenuPage;
