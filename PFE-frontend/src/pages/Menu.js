import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Fade, keyframes
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
  FileUpload, Add, Edit, FileDownload, CloudUpload,
  FolderDelete, Comment, WorkHistory
} from '@mui/icons-material';

// Animations
const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  0% { transform: scale(0.85); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
`;

const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const sections = [
  { text: "Importer un projet", icon: <FileUpload />, path: "/admin/upload" },
  { text: "Création", icon: <Add />, path: "/admin/createFile" },
  { text: "Modification", icon: <Edit />, path: "/admin/editfile" },
  { text: "Télécharger", icon: <FileDownload />, path: "/admin/download" },
  { text: "Deployer", icon: <CloudUpload />, path: "/admin/deploy" },
  { text: "Avis", icon: <Comment />, path: "/admin/avis" },
  { text: "Journal d'activité", icon: <WorkHistory />, path: "/admin/my-history" },
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
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Gradient Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg,rgb(189, 200, 227),rgb(201, 209, 221),rgb(232, 220, 213))',
          backgroundSize: '400% 400%',
          animation: `${gradientBG} 15s ease infinite`,
          zIndex: -1,
        }}
      />

      <Header />
      

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 4, py: 5,
          ml: '100px', mt: '60px', mr: '70px',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            fontFamily: 'Fira Sans, sans-serif',
            animation: `${fadeInUp} 1.2s ease-out`,
            textShadow: '0px 1px 1px rgba(94, 92, 92, 0.3)',
            color: '#1B374C',
            textAlign: 'center',
            mb: 6,
          }}
        >
          Bienvenue sur la plateforme
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {visibleItems.map((item, index) => {
            const delay = index * intervalDelay;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Fade in timeout={fadeDuration} style={{ transitionDelay: `${delay}ms` }} unmountOnExit>
                  <Paper
                    onClick={() => navigate(item.path)}
                    elevation={6}
                    sx={{
                      height: 180,
                      width: 250,
                      cursor: 'pointer',
                      borderRadius: '20px',
                      background: 'linear-gradient(145deg, #e0e7ff, #f5f7ff)',
                      border: '1px solid #dbeafe',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      fontFamily: 'Poppins',
                      animation: `${scaleIn} ${fadeDuration}ms ease ${delay}ms forwards`,
                      '&:hover': {
                        transform: 'scale(0.97)',
                        boxShadow: '0 0 0 2px #a5b4fc',
                        '& .iconZoom': {
                          transform: 'scale(1.3)',
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
                        color: 'rgb(48, 45, 102)',
                        fontSize: '2.5rem',
                      }}
                    >
                      {React.cloneElement(item.icon, { fontSize: 'inherit' })}
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '1.2rem',
                        color: ' #1E293B',
                        textAlign: 'center',
                        mt: 1,
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
