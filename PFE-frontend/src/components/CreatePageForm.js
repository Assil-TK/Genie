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
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import ProjectSelector from './ProjectSelector';
import PreviewBox3 from './PreviewBox3';
import AIFormPopup from './AIFormPopup';


export default function CreatePageForm() {
  const [pageName, setPageName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [filePaths, setFilePaths] = useState([]);
  const [selectedFilePath, setSelectedFilePath] = useState(null);

  useEffect(() => {
    const loadPaths = async () => {
      try {
        const paths = await fetchFilePaths();
        console.log('📁 filePaths:', paths);
        setFilePaths(paths);
        if (paths.length > 0) {
          setSelectedFilePath(paths[0].path);
        }
      } catch (err) {
        console.error("Erreur récupération chemins :", err);
        setError("Impossible de charger les chemins de fichiers.");
      }
    };
    loadPaths();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await generateCode(description);
      const generatedCode = res;
      setCode(generatedCode);
      setSuccessMsg('Code généré avec succès !');

      if (selectedFilePath) {
        console.log('🔄 syncToFrontend (after generate):', {
          relativePath: selectedFilePath,
          content: generatedCode
        });

        await syncToFrontend({
          relativePath: selectedFilePath,
          content: generatedCode
        });
      } else {
        console.warn('⚠️ Aucun chemin sélectionné pour syncToFrontend');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la génération du code.');
    }

    setLoading(false);
  };

  const handleCreatePage = async () => {
    try {
      const projet = await getActiveProject();
      if (!projet?.id) {
        alert("Aucun projet actif n’est sélectionné.");
        return;
      }

      await createFile({ pageName, code, projectId: projet.id });
      alert('Page créée avec succès !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création du fichier.');
    }
  };

  const handleCodeChange = async (e) => {
    const newValue = e.target.value;
    setCode(newValue);
    setError('');
    setSuccessMsg('');

    if (selectedFilePath) {
      console.log('🔄 syncToFrontend (onChange):', {
        relativePath: selectedFilePath,
        content: newValue
      });

      try {
        await syncToFrontend({
          relativePath: selectedFilePath,
          content: newValue
        });
      } catch (err) {
        console.error('Erreur de synchronisation en live:', err);
        setError('o');
      }
    } else {
      console.warn(' Aucun chemin sélectionné pour syncToFrontend');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <AIFormPopup onPromptReady={(newPrompt) => setDescription(newPrompt)} />

      {/* Sélecteur de projet */}
      <Box sx={{ ml: -3, mb: 2 }}>
        <ProjectSelector />
      </Box>


      {/* Description de l’objectif */}
      <Typography variant="h6" fontFamily="Poppins, sans-serif" gutterBottom textAlign="center" color='#1B374C'>
        Décrire ce que vous souhaitez créer
      </Typography>

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
          },
          disableUnderline: true,
        }}
        sx={{
          width: '90%',
          marginBottom: '1rem',
          alignSelf: 'center',
        }}
      />

      {/* Bouton Générer */}
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

      {/* Messages de succès / erreur */}
      {successMsg && (
        <Typography color="green" textAlign="center">{successMsg}</Typography>
      )}
      {error && (
        <Typography color="red" textAlign="center">{error}</Typography>
      )}

      {/* Code généré + Preview */}
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

      {/* Création de la page */}
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
    </Box>
  );

}
