import React, { useState } from "react";
import { TextField, Button, Box, MenuItem, Select, InputLabel } from "@mui/material";

const EditableElement = ({ initialProps, onSave, onCancel }) => {

  const initialText = initialProps.text || initialProps.children || "";
  const [localProps, setLocalProps] = useState({ ...initialProps, text: initialText });

  const handleChange = (propName, value) => {
    setLocalProps((prev) => {
      const newProps = { ...prev, [propName]: value };
      console.log("[EditableElement] Nouveau localProps:", newProps);
      return newProps;
    });
  };

  const handleSave = () => {
    // mettre à jour props children
    const updatedProps = { ...localProps, children: localProps.text };
    onSave(updatedProps);
    console.log("[EditableElement] Sauvegarde avec texte :", localProps.text);
    console.log("[EditableElement ]  updatedProps:", updatedProps);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, border: "1px solid #ccc" }}>
      <TextField
        label="Texte"
        value={localProps.text}
        onChange={(e) => handleChange("text", e.target.value)}
        fullWidth
      />
      
      <InputLabel>Variant</InputLabel>
      <Select
        value={localProps.variant || "body1"}
        onChange={(e) => handleChange("variant", e.target.value)}
        size="small"
      >
        <MenuItem value="h1">Titre H1</MenuItem>
        <MenuItem value="h2">Titre H2</MenuItem>
        <MenuItem value="h3">Titre H3</MenuItem>
        <MenuItem value="body1">Paragraphe</MenuItem>
        <MenuItem value="body2">Petit texte</MenuItem>
      </Select>

      <InputLabel>Couleur</InputLabel>
      <Select
        value={localProps.color || "black"}
        onChange={(e) => handleChange("color", e.target.value)}
        size="small"
      >
        <MenuItem value="black">Noir</MenuItem>
        <MenuItem value="red">Rouge</MenuItem>
        <MenuItem value="blue">Bleu</MenuItem>
        <MenuItem value="green">Vert</MenuItem>
        <MenuItem value="gray">Gris</MenuItem>
      </Select>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Sauvegarder
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Annuler
        </Button>
      </Box>
    </Box>
  );
};
export default EditableElement;