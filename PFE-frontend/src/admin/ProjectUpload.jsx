import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Paper,
  Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { keyframes } from '@mui/material/styles';
import { uploadProjectZip } from '../services/api';

const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ProjectUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith('.zip')) {
      setFile(selected);
      setMessage(null);
      setError(null);
    } else {
      setFile(null);
      setError('Veuillez sélectionner un fichier ZIP valide.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await uploadProjectZip(file);
      setMessage(res.message || 'Upload réussi');
    } catch (err) {
      setError(err?.response?.data?.error || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Animated Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgb(189, 200, 227), rgb(201, 209, 221), rgb(232, 220, 213))',
          backgroundSize: '400% 400%',
          animation: `${gradientBG} 15s ease infinite`,
          zIndex: -1,
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            width: '100%',
            maxWidth: 580,
            textAlign: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            marginTop:'-3rem',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#F39325',
              fontSize:'2rem',
              fontFamily: 'Fira Sans, sans-serif',
              fontWeight: 600,
              mb: 5,
            }}
          >
            Importer un projet local
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: '#5f6c7b', fontFamily: 'Poppins', mb: 3 }}
          >
            Téléversez un projet React compressé au format <strong>.zip</strong>.
          </Typography>

          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="upload-zip"
          />

          <Stack spacing={2} alignItems="center">
            <label htmlFor="upload-zip">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{
                  borderColor: '#1B374C',
                  color: '#1B374C',
                  fontWeight: 500,
                  textTransform: 'none',
                  ':hover': {
                    borderColor: '#1B374C',
                    backgroundColor: ' #f0f4f8',
                  },
                }}
              >
                Choisir un fichier ZIP
              </Button>
            </label>

            {file && (
              <Typography variant="body2" sx={{ color: '#7a8a9e' }}>
                Fichier sélectionné : <strong>{file.name}</strong>
              </Typography>
            )}

            {uploading && <LinearProgress sx={{ width: '100%' }} />}

            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!file || uploading}
              sx={{
                backgroundColor: ' #1B374C',
                color: 'white',
                fontWeight: 500,
                textTransform: 'none',
                ':hover': {
                  backgroundColor: '#142836',
                },
                width: '100%',
              }}
            >
              Importer le projet
            </Button>

            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProjectUpload;
