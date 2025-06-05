import React, { useState } from 'react';
import animation from '../assets/Animation1.gif';

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
import { uploadProjectZip } from '../services/api';

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
    <>
      {/* Background GIF */}
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
        }}
      />

      {/* Foreground content */}
      <Box sx={{ minHeight: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2 }}>
        <Paper
          elevation={4}
          align="center"
          sx={{
            p: 5,
            borderRadius: 4,
            width: '100%',
            maxWidth: 600,
            textAlign: "center",
            backgroundColor: 'rgba(255, 255, 255, 0.85)', // Optional: to make text readable
          }}
        >
          <Typography variant="h4" align='center' sx={{ color: "#F5B17B", fontFamily: "Poppins", mb: 3 }}>
            Importer un projet local
          </Typography>

          <Stack spacing={2}>
            <Typography variant="body1" sx={{ fontFamily: "Poppins", color: "#89A4C7" }}>
              Importez un projet React compressé au format <strong>.zip</strong>.
            </Typography>

            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="upload-zip"
            />

            <label htmlFor="upload-zip">
              <Button
                variant="outlined"
                component="span"
                sx={{ color: "#1B374C" }}
                startIcon={<CloudUploadIcon />}
              >
                Choisir un fichier ZIP
              </Button>
            </label>

            {file && (
              <Typography variant="body2" color="text.secondary">
                Fichier sélectionné : <strong>{file.name}</strong>
              </Typography>
            )}

            {uploading && <LinearProgress />}

            <Button
              sx={{ backgroundColor: "#89A4C7", color: "black" }}
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              Importer le projet
            </Button>

            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

export default ProjectUpload;
