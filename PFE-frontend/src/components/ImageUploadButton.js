import React, { useState } from 'react';
import axios from 'axios';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ImageUploadButton = ({ selectedRepo, onPathReady }) => {
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClick = () => {
    if (!selectedRepo) {
      showSnackbar('Repository name is missing.', 'error');
      console.error('No selectedRepo provided to ImageUploadButton.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('File is too large (max 5MB)', 'warning');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('repo', selectedRepo);
      formData.append('uploadPath', 'src/assets');
      formData.append('commitMessage', `Add ${file.name} to src/assets`);

      try {
        setUploading(true);
        const res = await axios.post(
          'http://localhost:5010/api/upload-image',
          formData,
          { withCredentials: true }
        );
        const imagePath = `../assets/${file.name}`;
        showSnackbar('Image uploaded successfully!', 'success');

        if (onPathReady) {
          onPathReady(imagePath);
        }
      } catch (err) {
        console.error('Upload failed:', err.response?.data || err.message);
        showSnackbar('Upload failed: ' + (err.response?.data?.error || err.message), 'error');
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  return (
    <>
      <Tooltip title={uploading ? 'Uploading...' : 'Upload Image'}>
        <span>
          <IconButton 
            onClick={!uploading ? handleClick : null} 
            disabled={uploading}
            size="large"
          >
            <AddPhotoAlternateIcon style={{ fontSize: 40, opacity: uploading ? 0.6 : 1 }} />
          </IconButton>
        </span>
      </Tooltip>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ImageUploadButton;
