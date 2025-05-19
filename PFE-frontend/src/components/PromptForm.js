import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const PromptForm = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit(prompt);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ margin: 2 }}>
      <TextField
        label="Entrer votre prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" type="submit">Générer la page</Button>
    </Box>
  );
};

export default PromptForm;
