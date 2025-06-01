import React, { useRef } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { uploadImage } from '../services/api';

const ImageUploadButton = ({ pageName, onUploadComplete }) => {
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('Uploading image for page/project:', pageName);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Get userId from localStorage or any auth context
      const userId = localStorage.getItem('userId'); 
      if (!userId) {
        console.error('No userId found, cannot upload image.');
        return;
      }

      formData.append('userId', userId);

      // Use pageName as projectName for backend
      if (pageName) {
        formData.append('projectName', pageName);
      } else {
        console.error('No projectName (pageName) provided.');
        return;
      }

      const result = await uploadImage(formData);
      console.log('Upload result:', result);

      if (onUploadComplete) {
        onUploadComplete(result.path);
      }
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Tooltip title="Upload an image">
        <IconButton onClick={handleIconClick}>
          <ImageIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default ImageUploadButton;
