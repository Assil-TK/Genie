import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUser, fetchRepos, fetchFiles, fetchFileContent } from '../api/githubApi';
import RepoSelector from '../components/RepoSelector';
import FileTree from '../components/FileTree';
import { Typography, Box, Divider, Paper } from '@mui/material';
import Sidebar from '../components/Sidebar copy';
import Header from '../components/Header git';
import { keyframes } from '@mui/material/styles';

const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const RepoExplorer = () => {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [fileTree, setFileTree] = useState([]);
  const [fileContent, setFileContent] = useState('');
  const [fileType, setFileType] = useState('text');
  const [selectedFile, setSelectedFile] = useState('');
  const [openFolders, setOpenFolders] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewComponent, setPreviewComponent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser()
      .then(res => setUser(res.user))
      .catch(() => (window.location.href = '/'));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5010/api/reset-filecontent', { method: 'POST' });
  }, []);

  useEffect(() => {
    if (user) {
      fetchRepos()
        .then(setRepos)
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (selectedRepo) {
      loadFiles();
    }
  }, [selectedRepo]);

  const loadFiles = async () => {
    if (!selectedRepo) return;
    setLoading(true);
    try {
      const files = await fetchFiles(selectedRepo);
      setFileTree(files);
    } catch (err) {
      console.error('Échec du chargement des fichiers :', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = async (filePath) => {
    try {
      const { content, encoding } = await fetchFileContent(selectedRepo, filePath);
      setSelectedFile(filePath);

      if (encoding === 'base64') {
        setFileType('binary');
        const ext = filePath.split('.').pop().toLowerCase();
        if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) {
          setFileContent(`data:image/${ext};base64,${content}`);
        } else {
          setFileContent('Le contenu du fichier binaire ne peut pas être affiché.');
        }
        setPreviewComponent(null);
      } else {
        setFileType('text');
        setFileContent(content);
        if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
          const Component = () => <div dangerouslySetInnerHTML={{ __html: content }} />;
          setPreviewComponent(() => Component);
        } else {
          setPreviewComponent(null);
        }
      }
    } catch (err) {
      console.error('Échec du chargement du contenu du fichier :', err);
    }
  };

  const handleEditClick = (filePath, content) => {
    navigate('/edit-file', {
      state: {
        fileContent: content,
        selectedRepo,
        selectedFile: filePath,
      },
    });
  };

  const handleNewFileClick = (folderPath) => {
    navigate('/generate', {
      state: {
        selectedRepo,
        parentFolderPath: folderPath,
      },
    });
  };

  const handleDeleteFile = async (repo, filePath) => {
    if (!window.confirm(`Supprimer le fichier ${filePath} ?`)) return;
    const commitMessage = `Supprimer ${filePath} via l'application`;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5010/api/delete-file', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ repo, path: filePath, message: commitMessage }),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = response.statusText;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || JSON.stringify(errorData);
        } catch {
          errorMessage = text;
        }
        alert(`Échec de la suppression du fichier : ${errorMessage}`);
        return;
      }

      alert('Fichier supprimé avec succès');
      await loadFiles();
    } catch (err) {
      alert('Erreur lors de la suppression du fichier : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = async (folderPath) => {
    const isOpen = openFolders[folderPath];
    setOpenFolders(prev => ({ ...prev, [folderPath]: !isOpen }));

    if (!isOpen) {
      setLoading(true);
      try {
        const files = await fetchFiles(selectedRepo, folderPath);
        setFileTree(prev => updateFileTree(prev, folderPath, files));
      } catch (err) {
        console.error('Échec du chargement du contenu du dossier :', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateFileTree = (tree, folderPath, newFiles, currentPath = '') => {
    return tree.map(file => {
      const fullPath = `${currentPath}/${file.name}`;
      if (file.type === 'dir') {
        if (fullPath === folderPath) {
          return { ...file, children: newFiles };
        }
        if (file.children) {
          return {
            ...file,
            children: updateFileTree(file.children, folderPath, newFiles, fullPath),
          };
        }
      }
      return file;
    });
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, rgb(189, 200, 227), rgb(201, 209, 221), rgb(232, 220, 213))',
          backgroundSize: '400% 400%',
          animation: `${gradientBG} 15s ease infinite`,
          zIndex: -1,
        }}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          px: 2,
          py: 7,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 6,
            borderRadius: 4,
            width: '100%',
            maxWidth: 1650,
            height: 'auto',
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            overflow: 'auto',
            ml:'3rem',
            mr:'-0.8rem'
          }}
        >
          <Header />
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: 40, overflowY: 'auto' }}>
              <Sidebar />
            </Box>

            <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
              <Typography
                                      variant="h3"
                                      sx={{
                                        color: "#F39325",
                                        fontFamily: "Poppins",
                                        mb: 5,
                                        fontWeight: "bold",
                                        textAlign: "center"
                                      }}
                                    >
                Bienvenue, {user?.username || user?.login}
              </Typography>

              <RepoSelector repos={repos} selectedRepo={selectedRepo} onSelectRepo={setSelectedRepo} />

              {selectedRepo && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h5" sx={{ fontFamily: 'Fira Sans, sans-serif', textAlign: 'center', fontWeight: 'medium', mb: 2, color: 'grey' }}>
                    Arborescence du dépôt
                  </Typography>

                  <FileTree
                    files={fileTree}
                    openFolders={openFolders}
                    handleFileClick={handleFileClick}
                    handleEditClick={handleEditClick}
                    toggleFolder={toggleFolder}
                    handleDeleteFile={(filePath) => handleDeleteFile(selectedRepo, filePath)}
                    fileContent={fileContent}
                    handleNewFileClick={handleNewFileClick}
                  />
                </>
              )}

              {selectedFile && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Fichier : <code>{selectedFile}</code>
                  </Typography>

                  {fileType === 'text' ? (
                    previewComponent ? (
                      <previewComponent />
                    ) : (
                      <pre style={{ backgroundColor: '#f4f4f4', padding: '1rem', borderRadius: '8px' }}>{fileContent}</pre>
                    )
                  ) : (
                    <img src={fileContent} alt="File preview" style={{ maxWidth: '100%', height: 'auto' }} />
                  )}
                </>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default RepoExplorer;
