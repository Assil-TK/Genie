import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import * as Babel from '@babel/standalone';
import { generateCode, createFile, getActiveProject } from '../services/api';
import * as MUIStyles from '@mui/styles';
import { Box, CircularProgress, TextField, Button, Typography } from '@mui/material';
import ProjectSelector from './ProjectSelector';

export default function CreatePageForm() {
  const [pageName, setPageName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [PreviewComponent, setPreviewComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await generateCode(description);
      console.log('Response from generate API:', res);
      const generatedCode = res;
      setCode(generatedCode);

      // const cleanCode = generatedCode
      // .replace(/import\s+React[^;]*;/g, '')
      // .replace(/import\s+ReactDOM[^;]*;/g, '')
      // .replace(/import\s+{([^}]*)}\s+from\s+['"]@mui\/material['"];/g, (_, components) => {
      //   const list = components.split(',').map(c => c.trim()).filter(Boolean);
      //   return list.map(c => `const ${c} = window.MUI.${c};`).join('\n');
      // })
      // .replace(/import\s+{([^}]*)}\s+from\s+['"]@mui\/material\/[^'"]+['"];/g, '')
      // .replace(/import\s+{([^}]*)}\s+from\s+['"]@mui\/system['"];/g, '')
      // .replace(/import\s+{([^}]*)}\s+from\s+['"]@mui\/styles['"];/g, (_, components) => {
      //   const list = components.split(',').map(c => c.trim()).filter(Boolean);
      //   return list.map(c => `const ${c} = window.MUIStyles.${c};`).join('\n');
      // })
      // .replace(/\bReactDOM\b/g, 'window.ReactDOM')
      // .replace(/\bReact\b/g, 'window.React');
      let cleanCode = generatedCode;

      // 1. Enlever import React et ReactDOM
      cleanCode = cleanCode
        .replace(/import\s+React[^;]*;/g, '')
        .replace(/import\s+ReactDOM[^;]*;/g, '');

      // 2. Gérer les imports de @mui/material (ex: import { Button } from '@mui/material';)
      cleanCode = cleanCode.replace(/import\s+{([^}]*)}\s+from\s+['"]@mui\/material['"];/g, (_, components) => {
        const list = components.split(',').map(c => c.trim()).filter(Boolean);
        return list.map(c => `const ${c} = window.MUI.${c};`).join('\n');
      });

      // 3. Gérer les imports de @mui/material/Component (ex: import { Card } from '@mui/material/Card';)
      cleanCode = cleanCode.replace(/import\s+{([^}]*)}\s+from\s+['"]@mui\/material\/([^'"]+)['"];/g, (_, components, folder) => {
        const list = components.split(',').map(c => c.trim()).filter(Boolean);
        return list.map(c => `const ${c} = window.MUI.${c};`).join('\n');
      });

      // 4. Gérer les imports de @mui/styles (ex: import { makeStyles } from '@mui/styles';)
      cleanCode = cleanCode.replace(/import\s+{([^}]*)}\s+from\s+['"]@mui\/styles['"];/g, (_, components) => {
        const list = components.split(',').map(c => c.trim()).filter(Boolean);
        return list.map(c => `const ${c} = window.MUIStyles.${c};`).join('\n');
      });

      // 5. Supprimer complètement les imports venant de @mui/system
      cleanCode = cleanCode.replace(/import\s+{([^}]*)}\s+from\s+['"]@mui\/system['"];/g, '');

      // 6. Remplacer les ReactDOM et React dans le code
      cleanCode = cleanCode
        .replace(/\bReactDOM\b/g, 'window.ReactDOM')
        .replace(/\bReact\b/g, 'window.React');



      const transformedCode = Babel.transform(cleanCode, {
        presets: ['react'],
      }).code;
      console.log("Code transformé :", transformedCode);

      window.React = React;
      window.ReactDOM = ReactDOM;
      window.MUIStyles = MUIStyles;

      const blob = new Blob([transformedCode], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);

      const module = await import(/* webpackIgnore: true */ blobUrl);
      const LoadedComponent = module.default;

      if (typeof LoadedComponent !== 'function') {
        setError('Le module généré ne contient pas de composant par défaut.');
        setPreviewComponent(null);
        return;
      }

      setPreviewComponent(() => LoadedComponent);
      setSuccessMsg('Prévisualisation générée avec succès !');

    } catch (err) {
      console.error(err);
      setError('Erreur lors de la génération ou du chargement du composant.');
      setPreviewComponent(null);
    }
    setLoading(false);
  };

  const handleCreatePage = async () => {
    try {
      const projet = await getActiveProject(); 
      if (!projet?.id) {
        alert("Aucun projet actif n’est sélectionné.");
        return;
      }
      const projectId = projet.id;
      await createFile({ pageName, code, projectId });
      alert('Page créée avec succès !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création du fichier.');
    }
  };
  

  return (
    // <div>
    //   {/* <input
    //     type="text"
    //     placeholder="Nom de la page"
    //     value={pageName}
    //     onChange={(e) => setPageName(e.target.value)}
    //     required
    //   /> */}
    //   <br /><br />

    //   <textarea
    //     placeholder="Décris ce que tu veux voir sur la page..."
    //     value={description}
    //     onChange={(e) => setDescription(e.target.value)}
    //     rows={4}
    //     cols={60}
    //   />
    //   <br /><br />

    //   <button onClick={handleGenerate} disabled={loading}>
    //     {loading ? 'Génération en cours...' : 'Générer avec IA'}
    //   </button>

    //   {error && <p style={{ color: 'red' }}>{error}</p>}
    //   {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

    //   {code && (
    //     <>
    //       <h4>Code généré :</h4>
    //       <textarea value={code} readOnly rows={10} cols={80} />
    //       <br /><br />
    //       <button onClick={handleCreatePage}>Créer la page</button>
    //     </>
    //   )}
    //   <br/>
    //   <input
    //     type="text"
    //     placeholder="Nom de la page"
    //     value={pageName}
    //     onChange={(e) => setPageName(e.target.value)}
    //     required
    //   />

    //   {PreviewComponent && (
    //     <>
    //       <h3>Prévisualisation :</h3>
    //       <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px' }}>
    //         {PreviewComponent && <PreviewComponent />}
    //       </div>
    //     </>
    //   )}
    // </div>
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <ProjectSelector />
      <Typography variant="h6" fontFamily="Poppins, sans-serif" gutterBottom textAlign="center">
        Décrire ce que vous souhaitez créer 
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Décris ce que tu veux voir sur la page..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Box textAlign="center" mb={3}>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={loading}
          sx={{
            backgroundColor: '#F39325',
            borderRadius: '20px',
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#d87f18',
            },
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
              Génération en cours...
            </>
          ) : (
            'Générer avec IA'
          )}
        </Button>
      </Box>

      {error && (
        <Typography color="error" textAlign="center" mb={2}>
          {error}
        </Typography>
      )}
      {successMsg && (
        <Typography color="green" textAlign="center" mb={2}>
          {successMsg}
        </Typography>
      )}

      {code && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontFamily="Poppins, sans-serif" gutterBottom>
            Code généré :
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={code}
            InputProps={{ readOnly: true }}
            sx={{ fontFamily: 'monospace' }}
          />

        </Box>
      )}

      <TextField
        fullWidth
        label="Nom de la page"
        placeholder="Nom de la page"
        value={pageName}
        onChange={(e) => setPageName(e.target.value)}
        sx={{ mb: 4 }}
      />

      {PreviewComponent && (
        <>
          <Typography variant="h6" fontFamily="Poppins, sans-serif" gutterBottom>
            Prévisualisation :
          </Typography>
          <Box sx={{ border: '1px solid #ccc', padding: 3, borderRadius: 2 }}>
            <PreviewComponent />
          </Box>
        </>
      )}
      <Box textAlign="center" mt={2}>
        <Button variant="contained" onClick={handleCreatePage} sx={{
            backgroundColor: '#F39325',
            borderRadius: '20px',
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#d87f18',
            },
          }}>
          Créer la page
        </Button>
      </Box>
    </Box>
  );
}
