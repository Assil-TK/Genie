import React, { useState } from 'react';
import axios from 'axios';

const ImageUploadButton = ({ selectedRepo, onPathReady }) => {
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    if (!selectedRepo) {
      alert('Repository name is missing.');
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
        alert('File is too large (max 5MB)');
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
        alert('✅ Image uploaded: ' + imagePath);

        // 🔁 Call the parent callback
        if (onPathReady) {
          onPathReady(imagePath);
        }
      } catch (err) {
        console.error('Upload failed:', err.response?.data || err.message);
        alert('❌ Upload failed: ' + (err.response?.data?.error || err.message));
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  return (
    <img
      src="/upload-icon.png"
      alt="Upload"
      onClick={!uploading ? handleClick : null}
      style={{
        cursor: uploading ? 'not-allowed' : 'pointer',
        opacity: uploading ? 0.6 : 1,
        width: 40,
        height: 40,
      }}
      title={uploading ? 'Uploading...' : 'Upload Image'}
    />
  );
};

export default ImageUploadButton;

