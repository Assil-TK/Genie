import React, { useRef } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { uploadImage } from '../services/api';

const ImageUploadButton = ({ projectName, pageName, onUploadComplete }) => {

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!projectName || !pageName) {
      console.error('Missing projectName or pageName.');
      return;
    }
      console.log("🔍 Rendered with projectName:", projectName);
  console.log("🔍 Rendered with pageName:", pageName);
    try {
      const formData = new FormData();
      formData.append('image', file); // field name must match multer setup
      formData.append('projectName', projectName);
      formData.append('pageName', pageName);

      const result = await uploadImage(formData);
      console.log('✅ Upload result:', result);

      if (onUploadComplete) onUploadComplete(result.path);

    } catch (err) {
      console.error('❌ Upload failed:', err);
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
