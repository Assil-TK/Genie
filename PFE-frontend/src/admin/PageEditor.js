import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Typography, Paper } from "@mui/material";
import { getPageById, updatePageContent } from "../services/api";
import EditableElement from "../components/EditableElement";
import { createEditableElementFromJson } from "../utils/renderUtils";

// Fonction récursive pour mettre à jour l'élément ciblé via un chemin imbriqué
const updateNestedElement = (data, pathParts, updatedProps) => {
  if (pathParts.length === 0) return data;
  const index = Number(pathParts[0]);
  if (isNaN(index) || index < 0 || index >= data.length) {
    console.error("updateNestedElement: index invalide", pathParts[0]);
    return data;
  }
  if (pathParts.length === 1) {
    data[index] = {
      ...data[index],
      props: { ...data[index].props, ...updatedProps },
      children: updatedProps.text !== undefined ? updatedProps.text : data[index].children,
    };
  } else {
    if (Array.isArray(data[index].children)) {
      data[index].children = updateNestedElement(
        [...data[index].children],
        pathParts.slice(1),
        updatedProps
      );
    } else {
      console.error("updateNestedElement: l'élément ciblé n'a pas d'enfants");
    }
  }
  return data;
};

const PageEditor = ({ pageId, onBack }) => {
  const { id } = useParams();
  const effectivePageId = pageId || id;
  const [page, setPage] = useState(null);
  const [content, setContent] = useState([]);
  // selectedElementPath sera une chaîne comme "0" ou "0-1"
  const [selectedElementPath, setSelectedElementPath] = useState(null);

  useEffect(() => {
    if (effectivePageId) {
      fetchPage(effectivePageId);
    }
  }, [effectivePageId]);

  const fetchPage = async (id) => {
    try {
      const fetchedPage = await getPageById(id);
      console.log("[PageEditor] Page chargée:", fetchedPage);
      setPage(fetchedPage);
      setContent(fetchedPage.content || []);
    } catch (error) {
      console.error("[PageEditor] Erreur de récupération de la page:", error);
    }
  };

  //récupérer le chemin de l'élément cliqué
  const handleSelectElement = (path, element) => {
    console.log("[PageEditor] Élément sélectionné, chemin :", path);
    setSelectedElementPath(path);
  };

  const updateElementByPath = (path, updatedProps) => {
    const pathParts = path.split("-");
    const updatedContent = updateNestedElement([...content], pathParts, updatedProps);
    console.log("[PageEditor] Contenu mis à jour:", updatedContent);
    setContent(updatedContent);
  };

  const handleSaveEdit = (updatedProps) => {
    if (selectedElementPath !== null) {
      updateElementByPath(selectedElementPath, updatedProps);
      setSelectedElementPath(null);
    }
  };

  const handleCancelEdit = () => {
    console.log("[PageEditor] Annulation de l'édition");
    setSelectedElementPath(null);
  };

  const handleAddElement = (path) => {
    console.log("[PageEditor] Ajout d'un nouvel élément dans le container au path :", path);
    const newElement = {
      type: "typography",
      props: { text: "Nouvel élément", variant: "body1", color: "textPrimary" },
      children: "Nouvel élément"
    };
    if(path === "0") {
      setContent(prev => [...prev, newElement]);
    } else {
      setContent(prev => addElementAtPath(prev,path, newElement));
    }
  };

  const handleDuplicateElement = (path, element) => {
    console.log("[PageEditor] duplication de l'element au path: ", path);
    setContent(prev => duplicateElementAtPath(prev, path));
  };

  const handleDeleteElement = () => {
    if (selectedElementPath) {
      const pathParts = selectedElementPath.split("-");
      const index = Number(pathParts[0]); // Pour une suppression au niveau racine
      const updatedContent = content.filter((_, i) => i !== index);
      setContent(updatedContent);
      setSelectedElementPath(null);
    }
  };

  const handleSave = async () => {
    try {
      console.log("[PageEditor] Enregistrement des modifications:", JSON.stringify(content, null, 2));
      await updatePageContent(effectivePageId, content);
      alert("Modifications enregistrées !");
    } catch (error) {
      console.error("[PageEditor] Erreur lors de l'enregistrement:", error);
      alert("Erreur lors de l'enregistrement !");
    }
  };

  //fonc inserer un element dans un container selon le path
  const addElementAtPath = (data, path, newElement) => {
    const indices = path.split("-").map(Number);
    const newData = [...data];
    let parent = newData;
    for (let i=0; i< indices.length; i++) {
      if(i === indices.length -1) {
        if(!parent[indices[i]].children) {
          parent[indices[i]].children = [];
        }
        parent[indices[i]].children.push(newElement);
      } else {
        parent =parent[indices[i]].children;
      }
      
    }
    return newData;
  };

  //fonc dupliquer un element localisé par son path
  const duplicateElementAtPath = (data, path) => {
    const indices = path.split("-").map(Number);
    const newData = [...data];
    let parent = newData;
    for (let i=0; i<indices.length -1; i++) {
      parent = parent[indices[i]].children;
    }
    const indexToDuplicate = indices[indices.length - 1];
    const elementToDuplicate = JSON.parse(JSON.stringify(parent[indexToDuplicate]));
    parent.splice(indexToDuplicate + 1, 0, elementToDuplicate);
    return newData;
  };

  // if (!effectivePageId) {
  //   return <Typography>Veuillez sélectionner une page..</Typography>;
  // }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {onBack && (
          <Button onClick={onBack} variant="outlined" sx={{
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
            mb: 2,

          }}>
            Précédent
          </Button>
        )}
      </Box>
      {page && <Typography variant="h6" gutterBottom>Modification de la page : {page.name}</Typography>}

      <Paper sx={{ p: 2, mb: 2, border: "1px solid gray" }}>
        {content.map((element, index) =>
          createEditableElementFromJson(element, `${index}`, handleSelectElement, handleAddElement, handleDuplicateElement)
        )}
      </Paper>

      {selectedElementPath !== null && (
        <Box sx={{ mb: 2 }}>
          <EditableElement
            initialProps={
              (function getSelectedProps(path, data) {
                const parts = path.split("-");
                let target = data;
                for (let i = 0; i < parts.length; i++) {
                  const idx = Number(parts[i]);
                  if (Array.isArray(target)) {
                    target = target[idx];
                  } else {
                    break;
                  }
                }
                return target ? target.props : {};
              })(selectedElementPath, content)
            }
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
          <Button onClick={handleDeleteElement} variant="outlined" color="error" sx={{ mt: 1 }}>
            Supprimer Élément
          </Button>
        </Box>
      )}

      <Button onClick={handleAddElement.bind(null, "0")} variant="contained" color="secondary" sx={{ mr: 1 }}>
        Ajouter Élément
      </Button>
      <Button onClick={handleSave} variant="contained" color="success">
        Enregistrer
      </Button>
    </Box>
  );
};

export default PageEditor;