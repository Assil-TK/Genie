import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GeneratePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedRepo, parentFolderPath } = location.state || {};

  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!fileName.trim()) {
      setError('Please enter a name.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5010/api/generate-file', {
        repo: selectedRepo,
        path: parentFolderPath,
        name: fileName,
      }, { withCredentials: true });

      console.log('File created:', response.data);
       // or wherever you want to go next
    } catch (err) {
      console.error('Error creating file:', err);
      setError('Failed to create file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Create New {parentFolderPath.includes('components') ? 'Component' : 'Page'}</h2>
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="Enter file name (e.g. MyComponent)"
        style={{ padding: '0.5rem', marginRight: '1rem', width: '300px' }}
      />
      <button onClick={handleCreate} disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default GeneratePage;
