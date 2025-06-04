import React, { useState, useEffect } from 'react';
import {
  generateCode,
  createFile,
  getActiveProject,
  fetchFilePaths,
  syncToFrontend
} from '../services/api';
import {
  Box,
  CircularProgress,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import ProjectSelector from './ProjectSelector';
import PreviewBox3 from './PreviewBox3';
import AIFormPopup from './AIFormPopup';
import ImageUploadButton from './ImageUploadButto2';

export default function CreatePageForm() {
  const [pageName, setPageName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const [filePaths, setFilePaths] = useState([]);
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [projectName, setProjectName] = useState(null);

  useEffect(() => {
    const loadPaths = async () => {
      try {
        const paths = await fetchFilePaths();
        setFilePaths(paths);
        if (paths.length > 0) {
          setSelectedFilePath(paths[0].path);
        }
      } catch (err) {
        setNotification({ open: true, message: "Impossible de charger les chemins de fichiers.", severity: 'error' });
      }
    };
    loadPaths();

    const loadProject = async () => {
      const projet = await getActiveProject();
      if (projet?.name) {
        setProjectName(projet.name);
      }
    };
    loadProject();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setNotification({ open: false, message: '', severity: 'info' });

    try {
      const res = await generateCode(description);
      setCode(res);
      setNotification({ open: true, message: 'Code généré avec succès !', severity: 'success' });

      if (selectedFilePath) {
        await syncToFrontend({
          relativePath: selectedFilePath,
          content: res,
        });
      }
    } catch (err) {
      setNotification({ open: true, message: 'Erreur lors de la génération du code.', severity: 'error' });
    }

    setLoading(false);
  };

  const handleCreatePage = async () => {
    try {
      const projet = await getActiveProject();
      if (!projet?.id) {
        setNotification({ open: true, message: "Aucun projet actif n’est sélectionné.", severity: 'error' });
        return;
      }

      await createFile({ pageName, code, projectId: projet.id });
      setNotification({ open: true, message: 'Page créée avec succès !', severity: 'success' });
    } catch (err) {
      setNotification({ open: true, message: 'Erreur lors de la création du fichier.', severity: 'error' });
    }
  };

  const handleCodeChange = async (e) => {
    const newValue = e.target.value;
    setCode(newValue);
    setNotification({ open: false, message: '', severity: 'info' });

    if (selectedFilePath) {
      try {
        await syncToFrontend({
          relativePath: selectedFilePath,
          content: newValue,
        });
      } catch (err) {
        setNotification({ open: true, message: 'Erreur de synchronisation en live.', severity: 'error' });
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <AIFormPopup onPromptReady={(newPrompt) => setDescription(newPrompt)} />

      <Box sx={{ ml: -3, mb: 2 }}>
        <ProjectSelector />
      </Box>

      <Typography variant="h6" fontFamily="Poppins, sans-serif" gutterBottom textAlign="center" color='#1B374C'>
        Décrire ce que vous souhaitez créer
      </Typography>

      {/* Wrapper box for description input + image upload button */}
      <Box
        sx={{
          position: 'relative',
          width: '90%',
          margin: '0 auto 1rem auto',
        }}
      >
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Décrivez ce que le fichier doit faire..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          InputProps={{
            sx: {
              padding: '1rem',
              borderRadius: '10px',
              fontSize: '1rem',
              backgroundColor: '#fff',
              paddingRight: '5rem', // add right padding so text doesn't go under button
            },
            disableUnderline: true,
          }}
        />

        {projectName && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              zIndex: 10,
            }}
          >
            <ImageUploadButton
              pageName="name"
              projectName={projectName}
              onUploadComplete={(imagePath) =>
                setDescription((prev) => prev + (prev ? '\n' : '') + imagePath)
              }
            />
          </Box>
        )}
      </Box>

      <Box textAlign="center" mb={6}>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={loading}
          disableElevation
          sx={{
            backgroundColor: loading ? '#888' : '#1976d2',
            color: 'white',
            padding: '0.6rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: loading ? '#888' : '#1565c0',
            },
          }}
        >
          {loading ? 'Génération en cours...' : 'Générer avec IA'}
        </Button>
      </Box>

      {code ? (
        <>
          <h4
            style={{
              marginTop: '2rem',
              marginBottom: '2rem',
              marginLeft: '-10rem',
              fontFamily: 'Fira Sans, sans-serif',
              color: 'grey',
              textAlign: 'left',
              width: '100%',
            }}
          >
            Code généré :
          </h4>

          <div
            style={{
              display: 'flex',
              width: '171%',
              gap: '2rem',
              marginLeft: '-14rem',
              justifyContent: 'space-between',
              alignItems: 'stretch',
              flexWrap: 'nowrap',
              marginRight: '-3rem',
            }}
          >
            <textarea
              value={code}
              onChange={handleCodeChange}
              rows={25}
              style={{
                resize: 'horizontal',
                minWidth: '300px',
                maxWidth: '70%',
                height: '600px',
                whiteSpace: 'pre',
                fontFamily: "'Fira Code', monospace",
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #ccc',
                background: '#f9f9fb',
                color: '#333',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                overflow: 'auto',
              }}
            />
            <div style={{ flex: 1, minWidth: '0' }}>
              <PreviewBox3 />
            </div>
          </div>
        </>
      ) : (
        <p
          style={{
            color: '#999',
            fontStyle: 'italic',
            marginTop: '4rem',
          }}
        >
          Pas encore de preview disponible.
        </p>
      )}

      <Box
        sx={{
          marginTop: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '80%',
          marginX: 'auto',
        }}
      >
        <TextField
          fullWidth
          placeholder="Nom de la page"
          value={pageName}
          onChange={(e) => setPageName(e.target.value)}
          variant="outlined"
          InputProps={{
            sx: {
              height: '42px',
              padding: '0 1rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: '#f0f0f0',
              color: '#000',
            },
            disableUnderline: true,
          }}
          sx={{
            width: '80%',
            marginTop: '2rem',
            marginBottom: '1rem',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleCreatePage}
          disabled={!code || loading}
          sx={{
            backgroundColor: code ? '#4caf50' : '#ccc',
            color: 'white',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: code ? 'pointer' : 'not-allowed',
            '&:hover': {
              backgroundColor: code ? '#43a047' : '#ccc',
            },
          }}
        >
          {loading ? 'Création...' : 'Valider'}
        </Button>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
