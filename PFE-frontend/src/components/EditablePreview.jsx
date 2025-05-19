import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { generateCodeFromPrompt, getPageCode, savePageCode } from '../services/api';
import * as Babel from '@babel/standalone';
import * as MUI from '@mui/material';
const { ThemeProvider, createTheme, CssBaseline } = MUI;
//import Box from '@mui/material';
const EditablePreview = ({ pageName }) => {
    const [instructions, setInstructions] = useState('');
    const [originalCode, setOriginalCode] = useState('');
    const [PreviewComponent, setPreviewComponent] = useState(null);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [modifiedCode, setModifiedCode] = useState('');
    const theme = createTheme({
        palette: {
            primary: {
                main: '#1B374C',      
                contrastText: '#fff'
            },
            secondary: {
                main: '#F57C00',      
                contrastText: '#fff'
            },
            background: {
                default: '#F5F5F5',
                paper: '#fff'
            }
        },
        typography: {
            fontFamily: '"Fira Sans", "Roboto", sans-serif',
            h1: {
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#1B374C'
            },
            h2: {
                fontSize: '2rem',
                fontWeight: 600
            },
            body1: {
                fontSize: '1rem',
                lineHeight: 1.6
            },
            button: {
                textTransform: 'none',
                fontWeight: 600
            }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        padding: '8px 24px'
                    }
                }
            },
            MuiContainer: {
                defaultProps: {
                    disableGutters: true
                }
            }
        },
        spacing: 8,  
    });

    useEffect(() => {
        window.React = React;
        window.ReactDOM = ReactDOM;
        window.MUI = MUI;
    }, [])

    useEffect(() => {
        console.log("EditablePreview loaded with pageName", pageName);

        const loadCode = async () => {
            setError(null);
            try {
                const res = await getPageCode(pageName);
                console.log("donnees recues: ", res);
                setOriginalCode(res.content);
                console.log("Code original récupéré :", res.content);
                console.log("res complet:", res);
                console.log("res.data:", res?.data);
                console.log("res.data.content:", res?.data?.content);
                setSuccessMsg(null);
                setPreviewComponent(null);
                setInstructions('');

            } catch (err) {
                console.error("Erreur chargement du code :", err);
                setError("Impossible de charger le code de la page.");
            }
        };

        if (pageName) loadCode();
    }, [pageName]);

    const handleGeneratePreview = async () => {
        console.log("handleGeneratePreview lancé");
        setError(null);
        setPreviewComponent(null);
        console.log("instructions:", instructions);
        console.log("originalCode:", originalCode);

        if (!instructions || !originalCode) {
            setError("Code original ou instructions manquants.");
            return;
        }
        try {
            const prompt = `
        Voici un code d'une application React. Veuillez modifier ce code en fonction des instructions suivantes.
        Instructions :
        ${instructions}
        Code original :
        ${originalCode} 
      `;
            console.log("prompt:", prompt);
            const modifiedCode = await generateCodeFromPrompt(prompt);

            console.log("Nouveau code généré :", modifiedCode);
            setModifiedCode(modifiedCode);

            if (!modifiedCode) {
                setError("Réponse invalide de l'API IA.");
                return;
            }

            const cleanCode = modifiedCode
                .replace(/import\s+React[^;]*;/g, '')
                .replace(/import\s+ReactDOM[^;]*;/g, '')
                .replace(/import\s+{([^}]*)}\s+from\s+['"]@mui\/material['"];/g, 'const {$1} = window.MUI;')
                .replace(/\bReactDOM\b/g, 'window.ReactDOM')
                .replace(/\bReact\b/g, 'window.React');

            const transformedCode = Babel.transform(cleanCode, {
                presets: ['react']
            }).code;

            console.log("Code transformé :", transformedCode);

            window.React = React;
            window.ReactDOM = ReactDOM;

            // Créer un blob JS à partir du code transformé
            const blob = new Blob([transformedCode], { type: 'application/javascript' });
            const blobUrl = URL.createObjectURL(blob);
            console.log("URL du Blob :", blobUrl);

            // Importer dynamiquement le module (ignore Webpack)
            const module = await import(/* webpackIgnore: true */ blobUrl);
            const LoadedComponent = module.default;
            if (typeof LoadedComponent !== 'function') {
                setError("Le module généré ne contient pas de composant par défaut.");
                return;
            }

            // Mettre à jour le state pour afficher le composant
            setPreviewComponent(() => LoadedComponent);
            setSuccessMsg("Prévisualisation générée avec succès !");


        } catch (err) {
            console.error("Erreur IA ou Blob preview", err);
            setError("Erreur lors de la génération avec l'IA.");
        }
    };

    const handleSave = async () => {
        try {
            const result = await savePageCode(pageName, modifiedCode);
            setSuccessMsg(result.message);
        } catch (err) {
            console.error("Erreur de sauvegarde :", err);
            setError("Impossible de sauvegarder les modifications.");
        }
    };

    return (
        <MUI.Box sx={{ marginTop: '2rem' }}>
            <MUI.Typography variant="h6">Décrire ce que vous souhaitez modifier</MUI.Typography>
            <MUI.TextField
            fullWidth
            multiline
                rows="4"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Ex : Ajoute une image au-dessus du titre"
                sx={{marginBottom: '1rem' }}
            />
            <MUI.Box sx={{ display: 'flex', justifyContent:'center', gap: '10px' }}>
                <MUI.Button onClick={handleGeneratePreview} disabled={!originalCode || !instructions} variant="contained" sx={{borderRadius:'20px', padding:'10px 30px', width:'auto', backgroundColor:"#1B374C"}}>Générer la prévisualisation</MUI.Button>
            </MUI.Box>
            {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
            {successMsg && <div style={{ color: 'green', marginTop: '1rem' }}>{successMsg}</div>}
            <MUI.Box sx={{ border: '1px solid #ddd', marginTop: '2rem', padding: '1rem' }}>
                {PreviewComponent
                    ? (
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <PreviewComponent />
                        </ThemeProvider>
                    )
                    : <em>Aucune prévisualisation disponible</em>
                }
            </MUI.Box>
            <MUI.Box sx={{ display: 'flex', justifyContent:'center',marginTop:'1rem', gap: '10px' }}>
            <MUI.Button onClick={handleSave} variant="contained" sx={{borderRadius:'20px', padding:'10px 30px',backgroundColor: "#F39325", marginTop:'1rem'}}>Sauvegarder les modifications</MUI.Button>
            </MUI.Box>
            
        </MUI.Box>
    );
};

export default EditablePreview;
