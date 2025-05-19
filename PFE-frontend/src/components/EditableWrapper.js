import React, { useState } from "react";
import { Box, IconButton, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
const EditableWrapper = ({ children, onEdit, onDuplicate, onAdd, isContainer }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={(e) => { e.stopPropagation(); onEdit && onEdit(); }} sx={{ position: "relative", border: hovered ? "1px dashed #1976d2" : "none", borderRadius: "4px", padding: "4px", transition: "border 0.2s", cursor: "pointer" }}>
      {hovered && (
        // <>
        // <IconButton size="small" sx={{ position:"absolute", top: 0, right:0, background:"#fff", zIndex: 2}} onClick={ (e) => { e.stopPropagation(); onEdit && onEdit();}}>
        //   <EditIcon fontSize="small"/>
        // </IconButton>
        // <IconButton size="small" sx={{ position: "absolute", bottom: 0, right: 0, background: "#fff", zIndex: 2 }} onClick={(e) => { e.stopPropagation(); onDuplicate && onDuplicate(); }}>
        //   <FileCopyOutlinedIcon fontSize="small" />
        // </IconButton>
        // </>
        <Box sx={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 0.5, background: "#fff", zIndex: 2, p: 0.5, borderRadius: 1 }}>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit && onEdit(); }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDuplicate && onDuplicate(); }}>
            <FileCopyOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      {children}
      {hovered && isContainer && (
        <Button variant="outlined" size="small" sx={{ position: "absolute", bittom: 0, left: 0, zIndex: 2 }} onClick={(e) => { e.stopPropagation(); onAdd && onAdd(); }}>
          Ajouter
        </Button>
      )}

    </Box>
  );
};

export default EditableWrapper;