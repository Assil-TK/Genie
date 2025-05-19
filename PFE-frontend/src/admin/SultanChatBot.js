import { Card, Typography, Container, CardContent, Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from "react-router-dom";
import { updatePageContent, generatePageFromPrompt, } from "../services/api";
import { createElementFromJson } from "../utils/renderUtils";
import DoneIcon from '@mui/icons-material/Done';
import CodeIcon from '@mui/icons-material/Code';

const SultanChatBot = () => {
  const { pageId } = useParams();
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [viewMode, setViewMode] = useState("preview"); 
  const [editedCode, setEditedCode] = useState("");
  const navigate = useNavigate();

  const handleGeneratedContent = async () => {
    try {
      const response = await generatePageFromPrompt(prompt);
      console.log("contenu généré:", response);
      setGeneratedContent(response);
      setEditedCode(JSON.stringify(response, null, 2));
      setViewMode("preview");
    } catch (error) {
      console.error("erreur lors de la generation du contenu", error);
    }
  };

  const handleUpdateContent = async () => {
    try {
      let contentToUpdate = generatedContent;
      if(viewMode === "code"){
        try {
          contentToUpdate = JSON.parse(editedCode);
          setGeneratedContent(contentToUpdate);
        } catch(parseError) {
          console.error("Erreur de parsing du code:", parseError);
          alert("Le code JSON n'est pas valide.");
          return;
        }
      }
      await updatePageContent(pageId, contentToUpdate);
      navigate(`/admin/dashboard`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contenu", error);
    }
  };

  const handlePrecedent = () => {
    navigate(-1);
  };

   const toggleViewMode = () => {
    if(generatedContent){
      if(viewMode === "code"){
        try {
          const updatedContent = JSON.parse(editedCode);
          console.log("Code parsé avec succès, nouvelle version:", updatedContent);
          alert("code JSON édité valide");
          setGeneratedContent(updatedContent);
          setViewMode("preview");
        } catch (e) {
          alert("Le code JSON est invalide. Veuillez corriger les erreurs.");
        }
      } else {
        setEditedCode(JSON.stringify(generatedContent, null, 2));
        setViewMode("code");
      }
    }
  };

  return (
    <Container sx={{ p: 10, bgcolor: "#f9f9f9", height: '600px' }}>
      <Typography variant="h4" align="center" sx={{ color: "#F39325", mb: 3 }}>
        Chatbot
      </Typography>
      <Typography variant="body1" align="center" sx={{ color: "#747474", mb: 3 }}>
        Décrivez la page que vous souhaitez créer
      </Typography>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Décrire le contenu de la page..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              multiline
              minRows={4}
            />
          </CardContent>
        </Card>
      </Container>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, px: 10 }}>
        <Button
          variant="outlined"
          sx={{ backgroundColor: '#F5F5F5', color: '#000', borderColor: '#1B374C', height: '40px', borderRadius: 5 }}
          onClick={handlePrecedent}
        >
          <ArrowBackIcon /> Précédent
        </Button>
        <Button variant="contained" sx={{ backgroundColor: '#1B374C', color: '#FFF', height: '40px', borderRadius: 5 }} onClick={handleGeneratedContent}>
          Générer
        </Button>
      </Box>
      {generatedContent && (
        <Box sx={{ mt: 6, px: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" align="center" sx={{ color: "#747474", mb: 3 }} gutterBottom>
          {viewMode === "preview" ? "Prévisualisation" : "Code généré"}
          </Typography>
          <Button variant="outlined" startIcon={<CodeIcon />} onClick={toggleViewMode} 
          sx={{ backgroundColor: '#F5F5F5', color: '#000', borderColor: '#1B374C', borderRadius: 5 }}>
              {viewMode === "preview" ? "Voir le Code" : "Voir la Prévisualisation"}
            </Button>
          </Box>
          {viewMode === "preview" ? (
            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#fff' }}>
            {Array.isArray(generatedContent)
              ? generatedContent.map((element, index) =>
                createElementFromJson(element, `preview-${index}`)
              )
              : createElementFromJson(generatedContent, 'preview')}
          </Box>
          ) : ( 
            <TextField
              fullWidth
              multiline
              minRows={10}
              value={editedCode}
              onChange={(e) => setEditedCode(e.target.value)}
              variant="outlined"
              sx={{ backgroundColor: "#fff", border: '1px solid #ddd', borderRadius: 2 }}
            />
          )}
          
        </Box>
        )}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button variant="contained" sx={{ backgroundColor: '#1B374C', color: '#FFF', height: '40px', borderRadius: 5 }} onClick={handleUpdateContent} >
          Valider<span><DoneIcon /></span>
        </Button>
      </Box>
    </Container>
  );
};
export default SultanChatBot;




