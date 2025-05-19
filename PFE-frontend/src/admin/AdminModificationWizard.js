import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CustomTreeView from "../components/CustomTreeView";
import { fetchPages } from "../services/api";
import PageEditor from "./PageEditor";

const AdminModificationWizard = () => {
  const [formattedPages, setFormattedPages] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const loadPages = async () => {
      try {
        const pagesList = await fetchPages();
        const treeData = pagesList.map((p) => ({
          id: p.id,
          label: p.name,
          children: []
        }));
        setFormattedPages(treeData);
      } catch (error) {
        console.error("[Wizard] Erreur chargement pages:", error);
      }
    };
    loadPages();
  }, []);

  const handleSelectNode = (node) => {
    setSelectedNode(node);
  };

  const handleNext = () => {
    if (selectedNode) {
      setStep(2);
    } else {
      alert(" sélectionner une page avant de continuer !");
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <Box sx={{ p: 2, marginLeft: 10, marginTop: 8 }}>
      {step === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>Modification</Typography>
          <br/>
          <Typography variant="h5" gutterBottom sx={{color: "#F39325"}}>Etape 1:</Typography>
          <Typography variant="body2" sx={{p: 3, marginBottom: 5}}>Veuillez selectionner la page sur laquelle vous souhaitez apporter des modifications</Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, marginTop: 5 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {selectedNode ? `${selectedNode.label}` : "Aucune page sélectionnée"}
            </Typography>
          </Box>

          <CustomTreeView data={formattedPages} onSelect={handleSelectNode} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button sx={{
            backgroundColor: "#F5F5F5",
            color: "#000",
            borderColor: "#1B374C",
            height: "40px",
            borderRadius: 5,
            "&:active": {
              backgroundColor: "#1B374C",
              color: "#FFF",
              borderColor: "#1B374C",
            },
            
          }}
          >
              Précédent
            </Button>
            <Button variant="contained"
          sx={{
            backgroundColor: "#1B374C",
            color: "#FFF",
            height: "40px",
            borderRadius: 5,
          }}
           onClick={handleNext}>
              Suivant
            </Button>
          </Box>
        </Box>
      )}

      {step === 2 && selectedNode && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{color: "#F39325"}}>Etape 2:</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedNode.label}
          </Typography>

          <PageEditor pageId={selectedNode.id} onBack={handleBack} />
        </Box>
      )}
    </Box>
  );
};

export default AdminModificationWizard;