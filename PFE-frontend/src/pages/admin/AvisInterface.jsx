import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Rating,
  Card, CardContent, Divider, CircularProgress, Paper
} from '@mui/material';
import { getAvis, createAvis } from '../../services/api';
import { keyframes } from '@mui/material/styles';

const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

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
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Animated background */}
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

      {/* White container */}
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
            maxWidth: 900,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            overflow: 'auto',
          }}
        >
          <Box maxWidth="700px" mx="auto">
            <Typography
                        variant="h4"
                        sx={{
                          color: "#F39325",
                          fontFamily: "Poppins",
                          mb: 5,
                          fontWeight: "bold",
                          textAlign: "center"
                        }}
                      >
              Avis des utilisateurs
            </Typography>

            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontFamily: 'Poppins', color: "#1B374C" }}>Note moyenne :&nbsp;</Typography>
              <Rating value={parseFloat(averageNote)} precision={0.1} readOnly />
              <Typography variant="body1">&nbsp;({averageNote}/5)</Typography>
            </Box>

            <Divider sx={{ mb: 5 }} />

            <form onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom sx={{ color: "#1B374C" }}>Laissez votre avis</Typography>
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
              <Button variant="contained" type="submit" sx={{ backgroundColor: '#1B374C', borderRadius: '20px' }}>Envoyer</Button>
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
        </Paper>
      </Box>
    </Box>
  );
};

export default AvisInterface;
