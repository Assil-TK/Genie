import React, { act, useEffect, useState } from 'react';
import { fetchFileList } from '../services/api';
import EditablePreview from './EditablePreview';
import { Alert, Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useProject } from '../contexts/ProjectContext';
import ProjectSelector from './ProjectSelector';
import { keyframes } from '@mui/material/styles';


const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const PageSelector = () => {
  const [files, setFiles] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const { activeProject } = useProject();
  useEffect(() => {
    const loadFiles = async () => {
      if (!activeProject) return;
      try {
        const fileList = await fetchFileList(activeProject);
        setFiles(fileList);
      } catch (err) {
        console.error('Erreur chargement des pages', err);
      }
    };
    loadFiles();
  }, [activeProject]);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Animated gradient background */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, rgb(189, 200, 227), rgb(201, 209, 221), rgb(232, 220, 213))',
          backgroundSize: '400% 400%',
          animation: `${gradientBG} 15s ease infinite`,
          zIndex: -1,
        }}
      />

      {/* Centered container */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '100vh',
          px: 2,
          py: 7,
          pt: '30px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            p: { xs: 2, md: 6 },
            borderRadius: 4,
            width: { xs: '100%', md: 1600 },
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            textAlign: 'center',
            overflow: 'auto',
            ml: { xs: 0, md: '1%' },
            mr: { xs: 0, md: '-4%' },
            boxShadow: `0px 3px 5px -1px rgba(0,0,0,0.2),
                0px 6px 10px 0px rgba(0,0,0,0.14),
                0px 1px 18px 0px rgba(0,0,0,0.12)`
          }}
        >


          <Typography
            variant='h4'
            sx={{
              fontFamily: 'Fira Sans, sans-serif',
              color: '#ff9800',
              fontWeight: 'bold',
              marginBottom: '2rem',
              fontSize: '2.8rem',
            }}
          >
            Modification de pages
          </Typography>

          {/* Project & Page selectors */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column', // force vertical layout
              alignItems: 'center',     // center horizontally
              gap: 3,
              mb: 3,
            }}
          >

            <Box sx={{ width: '100%', maxWidth: 600, ml: '-1.5rem', mt: '2rem' }}>
              <ProjectSelector />
            </Box>

            <FormControl
              fullWidth
              disabled={!activeProject}
              sx={{
                width: '100%',
                maxWidth: 400,
              }}
            >

              <InputLabel id="select-page-label">Choisir une page</InputLabel>
              <Select
                labelId="select-page-label"
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                label="Choisir une page"
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'Poppins, sans-serif',
                  },
                  '& .MuiSelect-icon': {
                    color: '#F39325',
                  },
                }}
              >
                <MenuItem value="">-- Choisir une page --</MenuItem>
                {files.map((file) => (
                  <MenuItem key={file} value={file}>
                    {file}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Alert or content */}
          {!activeProject ? (
            <Alert severity="warning" sx={{ maxWidth: 500, mx: 'auto' }}>
              Aucun projet sélectionné. Veuillez sélectionner un projet pour modifier ses pages.
            </Alert>
          ) : (
            selectedPage && (
              <EditablePreview pageName={selectedPage} projectName={activeProject} />
            )
          )}
        </Box>
      </Box>
    </Box>

  );


};

export default PageSelector;
