import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Rating,
  Card, CardContent, Divider, CircularProgress
} from '@mui/material';
import { getAvis, createAvis } from '../../services/api'; // <-- appel API

const AvisInterface = () => {
  const [avisList, setAvisList] = useState([]);
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(true);
  const [averageNote, setAverageNote] = useState(0);

  useEffect(() => {
    fetchAvis();
  }, []);

  const fetchAvis = async () => {
    try {
      const data = await getAvis();
      setAvisList(data);
      if (data.length > 0) {
        const total = data.reduce((sum, a) => sum + a.note, 0);
        setAverageNote((total / data.length).toFixed(1));
      }
      setLoading(false);
    } catch (err) {
      console.error("Erreur récupération des avis", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAvis(note, commentaire);
      setNote(5);
      setCommentaire('');
      fetchAvis();
    } catch (err) {
      alert("Erreur lors de l'envoi de l'avis.");
    }
  };

  return (
    <Box maxWidth="700px" mx="auto" sx={{p:10}}>
      <Typography variant="h4" gutterBottom align="center" sx={{fontFamily:'Poppins',color:'#F39325'}}>Avis des utilisateurs</Typography>

      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <Typography variant="h6"sx={{fontFamily:'Poppins', color:"#1B374C"}}>Note moyenne :&nbsp;</Typography>
        <Rating value={parseFloat(averageNote)} precision={0.1} readOnly />
        <Typography variant="body1">&nbsp;({averageNote}/5)</Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <form onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom sx={{color:"#1B374C"}}>Laissez votre avis</Typography>
        <Rating
          value={note}
          onChange={(e, newValue) => setNote(newValue)}
          size="large"
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Commentaire"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          sx={{ my: 2 }}
        />
        <Button variant="contained" type="submit" sx={{ backgroundColor: '#1B374C',borderRadius: '20px',}}>Envoyer</Button>
      </form>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>Derniers avis :</Typography>
      {loading ? (
        <CircularProgress />
      ) : avisList.length === 0 ? (
        <Typography>Aucun avis pour le moment.</Typography>
      ) : (
        avisList.map((avis) => (
          <Card key={avis.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography fontWeight="bold">{avis.username}</Typography>
                <Rating value={avis.note} readOnly />
              </Box>
              {avis.commentaire && (
                <Typography mt={1}>{avis.commentaire}</Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Posté le {new Date(avis.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default AvisInterface;
