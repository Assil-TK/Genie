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
    <Box sx={{ p:10, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={4} sx={{ p: 5, borderRadius: 4, width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" sx={{ color: "#F39325", fontFamily: "Poppins", mb: 3 }}>
          Importer un projet
        </Typography>

        <Stack spacing={2}>
          <Typography variant="body1">
            Uploadez un projet React compressé au format <strong>.zip</strong>.
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
              fullWidth
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
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || uploading}
            fullWidth
          >
            Uploader le projet
          </Button>

          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProjectUpload;
