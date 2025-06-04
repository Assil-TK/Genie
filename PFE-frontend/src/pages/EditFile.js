import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { fetchUser, fetchFileContent, updateFileContent } from '../api/githubApi';
import CommitDeployButton from '../components/CommitDeployButton';
import UserInfoWithTree from '../components/UserInfoWithTree';
import PreviewBox from '../components/PreviewBox';
import CommitInput from '../components/CommitInput';
import AIPromptBox from '../components/AIPromptBox';
import Sidebar from '../components/Sidebar copy';
import Header from '../components/Header git';
import ImageUploadButton from '../components/ImageUploadButton';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditFile = () => {
  const { state } = useLocation();
  const { selectedRepo, selectedFile } = state || {};

  const [user, setUser] = useState(null);
  const [content, setContent] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [sha, setSha] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser()
      .then(res => setUser(res.user))
      .catch(() => (window.location.href = '/'));
  }, []);

  useEffect(() => {
    const loadFile = async () => {
      if (!selectedRepo || !selectedFile) return;
      try {
        const { content, sha } = await fetchFileContent(selectedRepo, selectedFile);
        setContent(content);
        setSha(sha);
        if (user) {
          updateFileContentInPlatform(content, selectedFile);
        }
      } catch (err) {
        console.error('Error loading file:', err);
        setContent('// Error loading file content');
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [selectedRepo, selectedFile, user]);

  useEffect(() => {
    if (user) sendAllComponentsToBackend();
  }, [user]);

  const updateFileContentInPlatform = async (content, selectedFile) => {
    try {
      const repoUrl = `https://github.com/${selectedRepo}`;
      const branch = 'main';
      const username = user?.username || user?.login;

      await axios.post('http://localhost:5010/api/write-file-content', {
        content,
        repoUrl,
        branch,
        selectedFile,
        username,
      });
    } catch (error) {
      console.error('Failed to update filecontent.js:', error.response?.data || error.message);
    }
  };

  const sendAllComponentsToBackend = async () => {
    try {
      const username = user?.username || user?.login;
      const repoPath = `${username}/${selectedRepo}`;

      const fetchComponentFiles = async (path = '') => {
        const url = `https://api.github.com/repos/${repoPath}/contents/${path}`;
        const response = await axios.get(url);
        let filesToSend = [];

        for (const item of response.data) {
          if (item.type === 'dir') {
            const dirName = item.name.toLowerCase();
            if (dirName === 'component' || dirName === 'components') {
              const compFolderFiles = await axios.get(item.url);
              for (const file of compFolderFiles.data) {
                if (file.type === 'file' && /\.(js|jsx|ts|tsx)$/.test(file.name)) {
                  const fileContentResponse = await axios.get(file.download_url);
                  filesToSend.push({ filename: file.path, content: fileContentResponse.data });
                }
              }
            } else {
              const nestedFiles = await fetchComponentFiles(item.path);
              filesToSend = filesToSend.concat(nestedFiles);
            }
          }
        }

        return filesToSend;
      };

      const files = await fetchComponentFiles();
      await axios.post('http://localhost:5010/api/save-imported-components', { files });
    } catch (err) {
      console.error('Failed to send components to backend:', err.response?.data || err.message);
    }
  };

  const handleSave = async () => {
    try {
      const sanitizedFile = selectedFile.replace(/^\/+/, '');
      await updateFileContent(selectedRepo, sanitizedFile, content, sha, commitMessage || 'Update file');
      setSnack({ open: true, message: 'File saved successfully!', severity: 'success' });
    } catch (err) {
      console.error('Save failed:', err);
      setSnack({ open: true, message: 'Failed to save file.', severity: 'error' });
    }
  };

  const handleAIUpdate = async () => {
    setLoadingAI(true);
    try {
      const message = `Here is the code for the file: ${content} and I want to do the following: ${prompt}`;
      const response = await axios.post('https://coder-api.onrender.com/generate', {
        prompt: message,
      });

      const updatedCode = response.data.code;
      setContent(updatedCode);
      updateFileContentInPlatform(updatedCode, selectedFile);
    } catch (error) {
      console.error('Error communicating with AI API:', error);
      setSnack({ open: true, message: 'Failed to get AI response.', severity: 'error' });
    } finally {
      setLoadingAI(false);
    }
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  if (loading) return <p>Loading file...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '80%', transform: 'translateX(1%)' }}>
            <h1 style={{ fontFamily: 'Fira Sans, sans-serif', color: '#ff9800', textAlign: 'center', marginTop: '8%' }}>
              Modification de Pages
            </h1>

            <div style={{ marginTop: '3%' }}>
              <UserInfoWithTree user={user} selectedRepo={selectedRepo} selectedFile={selectedFile} />
            </div>

            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', backgroundColor: '#ffffff',
              width: '118%', borderRadius: '8px', padding: '1rem 1.5rem', marginBottom: '1.5rem',
              transform: 'translateX(-6%)', color: '#333', border: '1px solid #ddd'
            }}>
              <div style={{
                display: 'flex', gap: '1rem', alignItems: 'flex-start', width: '100%', justifyContent: 'center'
              }}>
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    updateFileContentInPlatform(e.target.value, selectedFile);
                  }}
                  rows={25}
                  style={{
                    flex: 1, minWidth: '300px', maxWidth: '50%', height: '600px', whiteSpace: 'pre',
                    fontFamily: "'Fira Code', monospace", padding: '1rem', borderRadius: '12px', border: '1px solid #ccc',
                    background: '#f9f9fb', color: '#333', fontSize: '0.95rem', lineHeight: '1.5',
                    resize: 'none', overflowY: 'scroll'
                  }}
                />

                <div style={{ flex: 1.4, minWidth: '400px' }}>
                  <PreviewBox />
                </div>
              </div>

              <div style={{ width: '80%', marginTop: '1rem' }}>
                <AIPromptBox
                  prompt={prompt}
                  setPrompt={setPrompt}
                  handleAIUpdate={handleAIUpdate}
                  loadingAI={loadingAI}
                >
                  <ImageUploadButton
                    selectedRepo={selectedRepo}
                    onPathReady={(imagePath) => setPrompt(prev => prev + (prev ? '\n' : '') + imagePath)}
                  />
                </AIPromptBox>
              </div>
            </div>

            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3rem', gap: '1rem',
              padding: '0 2rem'
            }}>
              <div style={{ width: '100%' }}>
                <CommitInput
                  commitMessage={commitMessage}
                  setCommitMessage={setCommitMessage}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                  onClick={handleSave}
                  style={{
                    padding: '0.6rem 1.2rem',
                    fontSize: '1rem',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '140px'
                  }}
                >
                  Save
                </button>

                {/* You can add your deploy button here */}
                {/* <CommitDeployButton /> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditFile;
