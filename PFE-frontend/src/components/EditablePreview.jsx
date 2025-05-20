import React, { useEffect, useState } from 'react';
import { generateCodeFromPrompt, getPageCode, savePageCode } from '../services/api';
import { Box, Typography, TextField, Button } from '@mui/material';

const EditablePreview = ({ pageName }) => {
    const [instructions, setInstructions] = useState('');
    const [originalCode, setOriginalCode] = useState('');
    const [modifiedCode, setModifiedCode] = useState('');
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    useEffect(() => {
        const loadCode = async () => {
            setError(null);
            try {
                const res = await getPageCode(pageName);
                const content = res.content || res?.data?.content || '';
                setOriginalCode(content);
                setModifiedCode(content);
                setSuccessMsg(null);
                setInstructions('');
            } catch (err) {
                console.error("Erreur chargement du code :", err);
                setError("Impossible de charger le code de la page.");
            }
        };
        if (pageName) loadCode();
    }, [pageName]);

    const handleGenerateCode = async () => {
        setError(null);
        setSuccessMsg(null);

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
            const newCode = await generateCodeFromPrompt(prompt);
            if (!newCode) {
                setError("Réponse invalide de l'API IA.");
                return;
            }
            setModifiedCode(newCode);
            setSuccessMsg("Code généré avec succès !");
        } catch (err) {
            console.error("Erreur IA :", err);
            setError("Erreur lors de la génération avec l'IA.");
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
        <Box sx={{ marginTop: '2rem' }}>
            <Typography variant="h6">Décrire ce que vous souhaitez modifier</Typography>
            <TextField
                fullWidth
                multiline
                rows={4}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Ex : Ajoute une image au-dessus du titre"
                sx={{ marginBottom: '1rem' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <Button
                    onClick={handleGenerateCode}
                    disabled={!originalCode || !instructions}
                    variant="contained"
                    sx={{ borderRadius: '20px', padding: '10px 30px', backgroundColor: "#1B374C" }}
                >
                    Générer via IA
                </Button>
            </Box>
            {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
            {successMsg && <div style={{ color: 'green', marginTop: '1rem' }}>{successMsg}</div>}
            <Typography variant="h6" sx={{ marginTop: '2rem' }}>Contenu du fichier</Typography>
            <TextField
                fullWidth
                multiline
                minRows={20}
                value={modifiedCode}
                onChange={(e) => setModifiedCode(e.target.value)}
                sx={{ marginTop: '1rem', fontFamily: 'monospace' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    sx={{ borderRadius: '20px', padding: '10px 30px', backgroundColor: "#F39325" }}
                >
                    Sauvegarder les modifications
                </Button>
            </Box>
        </Box>
    );
};

export default EditablePreview;
