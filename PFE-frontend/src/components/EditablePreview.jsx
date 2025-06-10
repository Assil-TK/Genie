import React, { useEffect, useState, useCallback } from 'react';
import {
    generateCodeFromPrompt,
    getPageCode,
    savePageCode,
    syncToFrontend,
    fetchFilePaths
} from '../services/api';
import { Box, Typography, TextField, Button } from '@mui/material';
import PreviewBox3 from './PreviewBox3';
import ImageUploadButton from './ImageUploadButto2';



const EditablePreview = ({ pageName, projectName }) => {
    const [instructions, setInstructions] = useState('');
    const [originalCode, setOriginalCode] = useState('');
    const [modifiedCode, setModifiedCode] = useState('');
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [filePaths, setFilePaths] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const loadPaths = async () => {
            try {
                const paths = await fetchFilePaths();
                setFilePaths(paths);
            } catch (err) {
                console.error("Erreur récupération chemins :", err);
                setError("Impossible de charger les chemins de fichiers.");
            }
        };
        loadPaths();
    }, []);

    const getExactPath = useCallback(() => {
        if (!filePaths.length || !pageName) return null;
        const normalized = pageName.toLowerCase();

        const match = filePaths.find(f => {
            const fileName = f.name.toLowerCase();
            return (
                fileName === normalized ||
                fileName === normalized + '.js' ||
                fileName === normalized + '.jsx' ||
                fileName.replace(/\.[^/.]+$/, '') === normalized
            );
        });

        return match ? match.path : null;
    }, [filePaths, pageName]);

    useEffect(() => {
        const loadCode = async () => {
            if (!filePaths.length) return;

            setError(null);
            try {
                const res = await getPageCode(pageName);
                const content = res.content || res?.data?.content || '';
                setOriginalCode(content);
                setModifiedCode(content);
                setSuccessMsg(null);
                setInstructions('');

                const exactPath = getExactPath();
                if (exactPath) {
                    await syncToFrontend({
                        relativePath: exactPath,
                        content,
                    });
                } else {
                    setError(`Chemin exact introuvable pour la page "${pageName}".`);
                }
            } catch (err) {
                console.error("Erreur chargement du code :", err);
                setError("Impossible de charger le code de la page.");
            }
        };

        if (pageName && filePaths.length) {
            loadCode();
        }
    }, [pageName, filePaths, getExactPath]);

    const handleGenerateCode = async () => {
    setError(null);
    setSuccessMsg(null);

    if (!instructions || !modifiedCode) {
        setError("Code actuel ou instructions manquants.");
        return;
    }

    setLoading(true); // Start loading
    try {
        const prompt = `
Voici un code d'une application React. Veuillez modifier ce code en fonction des instructions suivantes.
Instructions :
${instructions}
Code actuel :
${modifiedCode}
`;

        const newCode = await generateCodeFromPrompt(prompt);
        if (!newCode) {
            setError("Réponse invalide de l'API IA.");
            return;
        }

        setModifiedCode(newCode);
        setSuccessMsg("Code généré avec succès !");

        const exactPath = getExactPath();
        if (exactPath) {
            try {
                await syncToFrontend({
                    relativePath: exactPath,
                    content: newCode,
                });
            } catch (err) {
                console.error("Erreur de synchronisation post-génération :", err);
                setError("Erreur de synchronisation après génération du code.");
            }
        } else {
            setError(`Chemin exact introuvable pour la page "${pageName}".`);
        }
    } catch (err) {
        console.error("Erreur IA :", err);
        setError("Erreur lors de la génération avec l'IA.");
    } finally {
        setLoading(false); // End loading
    }
};

    const handleSave = async () => {
        try {
            const result = await savePageCode(pageName, modifiedCode);
            setSuccessMsg(result.message || "Modifications sauvegardées avec succès !");
        } catch (err) {
            console.error("Erreur de sauvegarde :", err);
            setError("Impossible de sauvegarder les modifications.");
        }
    };

    return (
        <Box sx={{ marginTop: '4rem' }}>
            <Typography variant="h6" fontFamily="Poppins, sans-serif" gutterBottom textAlign="center" color='#1B374C'>Décrire ce que vous souhaitez modifier</Typography>
            <Box sx={{ position: 'relative', marginBottom: '1rem', width: '60%', ml: '15rem' }}>
  <TextField
    fullWidth
    multiline
    rows={4}
    value={instructions}
    onChange={(e) => setInstructions(e.target.value)}
    placeholder="Ex: Ajoute un bouton au-dessus de titre"
    sx={{
      mt:'1rem',
      backgroundColor: '#fff',
      borderRadius: '10px',
      '& .MuiOutlinedInput-root': {
        borderRadius: '10px', // Also applies radius to the input box
      },
    }}
  />


  <Box sx={{ position: 'absolute', bottom: 10, right: 10 }}>
    <ImageUploadButton
        pageName={pageName}
        projectName={projectName.name} 
        onUploadComplete={(imagePath) =>
          setInstructions((prev) => prev + (prev ? '\n' : '') + imagePath)
        }
        
      />

  </Box>
</Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
  <Button
    onClick={handleGenerateCode}
    disabled={!originalCode || !instructions || loading}
    variant="contained"
    disableElevation
    sx={{
      backgroundColor: loading ? '#888' : 'rgb(22, 195, 51)',
      color: 'white',
      padding: '0.6rem 1.5rem',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: loading ? 'not-allowed' : 'pointer',
      textTransform: 'none',
      '&:hover': {
        backgroundColor: loading ? '#888' : 'rgb(15, 154, 43)',
      },
    }}
  >
    {loading ? 'En cours...' : 'Générer via IA'}
  </Button>
</Box>


            {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
            {successMsg && <div style={{ color: 'green', marginTop: '1rem' }}>{successMsg}</div>}

            <Typography variant="h6" sx={{ marginTop: '4rem', ml:'-56rem' }}>Contenu du fichier :</Typography>

            <Box sx={{ display: 'flex', gap: '2rem', marginTop: '2rem', height: '600px', width: '100%' }}>
                <Box
                    sx={{
                        resize: 'horizontal',
                        overflow: 'auto',
                        minWidth: '100px',
                        maxWidth: '75%',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '0.5rem',
                    }}
                >
                    <textarea
                        value={modifiedCode}
                        onChange={async (e) => {
                            const newValue = e.target.value;
                            setModifiedCode(newValue);
                            setLoading(true); // Start loading during auto-sync
                            try {
                                const exactPath = getExactPath();
                                if (!exactPath) {
                                    setError(`Chemin exact introuvable pour la page "${pageName}".`);
                                    return;
                                }
                                await syncToFrontend({
                                    relativePath: exactPath,
                                    content: newValue,
                                });
                            } catch (err) {
                                console.error("Erreur de synchronisation automatique :", err);
                                setError("Erreur de synchronisation automatique.");
                            } finally {
                                setLoading(false); // End loading
                            }
                        }}
                        style={{
                            width: '100%',
                            height: '100%',
                            resize: 'none',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre',
                            overflow: 'auto',
                            border: 'none',
                            outline: 'none',
                        }}
                    />
                </Box>

                <Box sx={{ flex: 1, height: '100%', overflow: 'auto' }}>
                    <PreviewBox3 />
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', mb:'2rem' }}>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                        borderRadius: '20px',
                        padding: '10px 30px',
                        backgroundColor: "rgb(25, 108, 176)"
                    }}
                >
                    Sauvegarder les modifications
                </Button>
            </Box>
        </Box>
    );
};

export default EditablePreview;
