import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Fade, keyframes } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
  FileUpload, Add, Edit, FileDownload, CloudUpload, FolderDelete,
  Comment, WorkHistory, ManageHistory
} from '@mui/icons-material';

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

const fadeDuration = 600; // milliseconds
const intervalDelay = 400; // ms delay between each item fade-in

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
    <Box sx={{ display: 'flex' }}>
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
                      '&:hover': {
                        transform: 'scale(1.03)',
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        boxShadow: 'none',
                      },
                      display: 'flex',
                      flexDirection: 'column', // Stack vertically
                      alignItems: 'center',     // Center horizontally
                      justifyContent: 'center', // Center vertically
                      gap: 1,
                      fontFamily: 'Poppins',
                      animationName: `${popScale}`,
                      animationDuration: `${fadeDuration}ms`,
                      animationFillMode: 'forwards',
                      animationTimingFunction: 'ease',
                      animationDelay: `${delay}ms`,
                    }}
                  >
                    {item.icon}
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '1.25rem', // Slightly bigger
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
