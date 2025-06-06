import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PreviewBox from '../components/PreviewBox2'; // ajustez le chemin si nécessaire
import Sidebar from '../components/Sidebar copy';
import Header from '../components/Header git';
import AIFormPopup from '../components/AIFormPopup';
import ImageUploadButton from '../components/ImageUploadButton';
import loadingGif from '../assets/lamp (3).gif';

const GeneratePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedRepo, parentFolderPath } = location.state || {};

  const [fileName, setFileName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const updateFileContent2 = async (newContent) => {
    try {
      await axios.post('http://localhost:5010/api/write-generated-content', {
        content: newContent,
      });
    } catch (err) {
      console.error('Erreur lors de la mise à jour de filecontent2.js:', err.response?.data || err.message);
    }
  };


  const handleImageUpload = (imagePath) => {
    setPrompt((prev) => prev + ` ${imagePath}`);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Veuillez entrer une description.');
      return;
    }

    setError('');
    setLoading(true);
    setGeneratedCode('');

    try {
      const message = `Génère du code pour cette demande : ${prompt}`;
      const response = await axios.post('https://creation-ai-api.onrender.com/generate', {
        prompt: message,
      });

      const updatedCode = response.data.code;
      if (!updatedCode) throw new Error('Aucun code retourné par l’IA.');

      setGeneratedCode(updatedCode);
      await updateFileContent2(updatedCode);

    } catch (error) {
      console.error('Erreur pendant la génération ou l’écriture :', error);
      setError("Échec de la réponse de l'IA ou de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!fileName.trim() || !generatedCode.trim()) {
      setError("Le nom du fichier ou le code est manquant.");
      return;
    }

    setError('');
    setCreating(true);

    try {
      const response = await axios.post(
        'http://localhost:5010/api/generate-file',
        {
          repo: selectedRepo,
          path: parentFolderPath,
          name: fileName,
          content: generatedCode,
        },
        { withCredentials: true }
      );

      console.log('Fichier créé :', response.data);
      navigate(-1);
    } catch (err) {
      console.error('Erreur lors de la création du fichier :', err);
      setError("Échec de la création du fichier.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <AIFormPopup onPromptReady={(newPrompt) => setPrompt(newPrompt)} />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />



        <div
          style={{
            flex: 1,
            padding: '2rem',
            overflowY: 'auto',
            marginLeft: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontFamily: 'Fira Sans, sans-serif',
              color: '#ff9800',
              textAlign: 'center',
              marginBottom: '4rem',
              marginTop: '8%',
            }}
          >
            Créer {parentFolderPath?.includes('components') ? 'Un Nouveau Composant' : 'Une Nouvelle Page'}
          </h1>


          <div style={{
            position: 'relative',
            width: '60%',
            alignSelf: 'center',
            marginBottom: '1rem'
          }}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Décrivez ce que le fichier doit faire..."
              rows={4}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '20px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                boxSizing: 'border-box',
                resize: 'none',
              }}
            />

            <div style={{
              position: 'absolute',
              bottom: '10px',
              transform: 'scale(0.8)',
              right: '10px'
            }}>
              <ImageUploadButton
                selectedRepo={selectedRepo}
                onPathReady={(imagePath) =>
                  setPrompt((prev) => prev + (prev ? '\n' : '') + imagePath)
                }
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#888' : '#1976d2',
              color: 'white',
              padding: '0.6rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '2rem',
            }}
          >
            {loading ? 'En cours...' : 'Générer avec IA'}
          </button>

          {loading ? (
  <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <img src={loadingGif} alt="Chargement..." style={{ width: '80px', height: '80px' }} />
      <p style={{ color: '#999', fontStyle: 'italic' }}>Génération en cours...</p>
    </div>
) : !generatedCode ? (
  <p style={{ color: '#999', fontStyle: 'italic', marginTop: '4rem' }}>
    Pas encore de preview disponible.
  </p>
) : (
  <>
    <h4
      style={{
        marginTop: '2rem',
        marginBottom: '2rem',
        marginLeft: '2rem',
        fontFamily: 'Fira Sans, sans-serif',
        color: 'grey',
        textAlign: 'left',
        width: '100%',
      }}
    >
      Code généré :
    </h4>

    <div
      style={{
        display: 'flex',
        width: '100%',
        gap: '2rem',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        marginRight: '-3rem',
      }}
    >
      <textarea
        value={generatedCode}
        onChange={(e) => {
          setGeneratedCode(e.target.value);
          updateFileContent2(e.target.value);
        }}
        rows={25}
        style={{
          resize: 'horizontal',
          minWidth: '300px',
          maxWidth: '70%',
          height: '600px',
          whiteSpace: 'pre',
          fontFamily: "'Fira Code', monospace",
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid #ccc',
          background: '#f9f9fb',
          color: '#333',
          fontSize: '0.95rem',
          lineHeight: '1.5',
          overflow: 'auto',
        }}
      />
      <div style={{ flex: 1, minWidth: '0' }}>
        <PreviewBox />
      </div>
    </div>
  </>
)}


          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

          {/* File name and creation button (always visible but disabled until code is generated) */}
          <div
            style={{
              marginTop: '3rem',
              display: 'flex',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '80%',
              opacity: generatedCode ? 1 : 0.5,
              pointerEvents: generatedCode ? 'auto' : 'none',
            }}
          >
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Nom du fichier"
              disabled={!generatedCode}
              style={{
                padding: '0.6rem 1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '1rem',
                width: '80%',
                marginTop: '2rem',
                marginBottom: '1rem',
                flex: 1,
                backgroundColor: generatedCode ? 'white' : '#f0f0f0',
                color: generatedCode ? '#000' : '#888',
              }}
            />
            <button
              onClick={handleCreate}
              disabled={!generatedCode || creating}
              style={{
                backgroundColor: generatedCode ? '#4caf50' : '#ccc',
                color: 'white',
                padding: '0.6rem 1.2rem',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: generatedCode ? 'pointer' : 'not-allowed',
              }}
            >
              {creating ? 'Création...' : 'Valider'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );



};

export default GeneratePage;
