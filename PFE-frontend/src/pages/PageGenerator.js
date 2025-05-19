import React, {useState} from "react";
import {Container, Typography} from "@mui/material";
import PromptForm from "../components/PromptForm";
import ValidationDialog from "../components/ValidationDialog";
import PageRenderer from "../client/PageRenderer";
import { generatePageFromPrompt, updatePageContent} from "../services/api";

const PageGenerator = () => {
    const [generatedJson, setGeneratedJson] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pageValidated, setPageValidated] = useState(false);

  // Pour cet exemple, nous supposons que l'ID et la route de la page sont fixes.
  // Dans votre application, ils pourraient être définis dynamiquement.
  const pageId = "1";
  const pageRoute = "home";

  // Soumettre le prompt pour générer le JSON via l'API
  const handlePromptSubmit = async (prompt) => {
    console.log("Envoi du prompt:", prompt);
    try {
      const content = await generatePageFromPrompt(prompt);
      console.log("JSON généré reçu:", content);
      setGeneratedJson(content);
      setDialogOpen(true);
    } catch (error) {
      console.error("Erreur lors de la génération du JSON:", error);
    }
  };

  // Lorsque l'administrateur valide la page générée
  const handleValidate = async () => {
    try {
      console.log("Validation du contenu généré");
      // Met à jour la page avec le JSON généré
      const page = await updatePageContent(pageId, generatedJson);
      console.log("Page mise à jour:", page);
      setDialogOpen(false);
      setPageValidated(true);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la page:", error);
    }
  };

  // Si l'administrateur souhaite rectifier, il peut modifier le prompt pour obtenir une nouvelle génération
  const handleRectify = async () => {
    const newPrompt = window.prompt("Modifier le prompt pour rectification :", "");
    if (newPrompt) {
      try {
        const content = await generatePageFromPrompt(newPrompt);
        console.log("Nouveau JSON généré:", content);
        setGeneratedJson(content);
      } catch (error) {
        console.error("Erreur lors de la régénération:", error);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Générateur de Page par IA
      </Typography>
      {/* Si la page n'est pas encore validée, afficher le formulaire de prompt */}
      {!pageValidated && !generatedJson && (
        <PromptForm onSubmit={handlePromptSubmit} />
      )}
      {/* Une fois le contenu généré, afficher une modale de prévisualisation et validation */}
      {generatedJson && (
        <ValidationDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          generatedJson={generatedJson}
          onValidate={handleValidate}
          onRectify={handleRectify}
        />
      )}
      {/* Une fois validée, afficher le rendu final de la page */}
      {pageValidated && (
        <>
          <Typography variant="h5" align="center" sx={{ mt: 2 }}>
            Page Validée :
          </Typography>
          <PageRenderer route={pageRoute} />
        </>
      )}
    </Container>
  );
};

export default PageGenerator;
