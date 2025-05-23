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
      console.warn('⚠️ Aucun chemin sélectionné pour syncToFrontend');
    }
  };

  return (
  <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
    <ProjectSelector />

    <Typography variant="h6" fontFamily="Poppins, sans-serif" gutterBottom textAlign="center">
      Nom de la page
    </Typography>
    <TextField
      fullWidth
      placeholder="Nom de la page"
      value={pageName}
      onChange={(e) => setPageName(e.target.value)}
      sx={{ mb: 3 }}
    />

    <Typography variant="h6" fontFamily="Poppins, sans-serif" gutterBottom textAlign="center">
      Décrire ce que vous souhaitez créer
    </Typography>

    <TextField
      fullWidth
      multiline
      rows={4}
      placeholder="Décris ce que tu veux voir sur la page..."
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      sx={{ mb: 3 }}
    />

    <Box textAlign="center" mb={3}>
      <Button
        variant="contained"
        onClick={handleGenerate}
        disabled={loading}
        sx={{
          backgroundColor: '#F39325',
          borderRadius: '20px',
          px: 4,
          py: 1.5,
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#d87f18',
          },
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
            Génération en cours...
          </>
        ) : (
          'Générer avec IA'
        )}
      </Button>
    </Box>

    {successMsg && <Typography color="green" textAlign="center">{successMsg}</Typography>}
    {error && <Typography color="red" textAlign="center">{error}</Typography>}

    <TextField
      fullWidth
      multiline
      rows={16}
      placeholder="Code généré..."
      value={code}
      onChange={handleCodeChange}
      sx={{ mt: 3 }}
    />

    {/* PREVIEW */}
    <Typography variant="h6" fontFamily="Poppins, sans-serif" sx={{ mt: 4 }} gutterBottom>
      Aperçu
    </Typography>

    <Box
      sx={{
        width: '100%',
        minHeight: '300px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: 2,
        mt: 1,
        mb: 4,
        backgroundColor: '#f9f9f9',
      }}
    >
      {code ? <PreviewBox3 /> : <Typography>Pas encore de preview disponible.</Typography>}
    </Box>

    <Box textAlign="center" mt={3}>
      <Button
        variant="contained"
        onClick={handleCreatePage}
        sx={{
          backgroundColor: '#1B374C',
          borderRadius: '20px',
          px: 4,
          py: 1.5,
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#102331',
          },
        }}
      >
        Sauvegarder la page
      </Button>
    </Box>
  </Box>
);

}
