import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from "@mui/material";
import {
  Home as HomeIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  WorkHistory as WorkHistoryIcon,
  FolderDelete as FolderDeleteIcon,
  CloudUpload as CloudUploadIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  Comment as CommentIcon
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { removeFromFrontend } from "../services/api";

const Sidebar = () => {
  const navigate = useNavigate();

  const pathsThatNeedCleanup = [
    "/admin/createFile",
    "/admin/editfile",
    "/admin/delete",
    "/admin/upload",
    "/admin/deploy"
  ];

  const handleNavigation = async (path) => {
    if (pathsThatNeedCleanup.includes(path)) {
      try {
        await removeFromFrontend();
        console.log("Composant frontend supprimé avec succès.");
      } catch (error) {
        console.error("Erreur suppression composant frontend :", error.message);
      }
    }
    navigate(path);
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/home" },
    { text: "Importer un projet", icon: <FileUploadIcon />, path: "/admin/upload" },
    { text: "Création", icon: <AddIcon />, path: "/admin/createFile" },
    { text: "Modification", icon: <EditIcon />, path: "/admin/editfile" },
    { text: "Télécharger", icon: <FileDownloadIcon />, path: "/admin/download" },
    { text: "Deployer", icon: <CloudUploadIcon />, path: "/admin/deploy" },
    
    { text: "Avis", icon: <CommentIcon />, path: "/admin/avis" },
    { text: "Journal d'activité", icon: <WorkHistoryIcon />, path: "/admin/my-history" },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 60,
        
        flexShrink: 0,
        position: 'fixed',
        zIndex: 1200,
        height: "100vh",
        "& .MuiDrawer-paper": {
          width: 60,
          overflowX: "hidden",
          backgroundColor: '#f7f7f7',
        },
      }}
    >
      <List sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: '64px' }}>
        {menuItems.map((item, index) => (
          <Tooltip title={item.text} placement="right" key={index}>
            <ListItem button onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
            </ListItem>
          </Tooltip>
        ))}

        <Box sx={{ marginTop: 'auto' }}>
          <Tooltip title="Paramètres" placement="right">
            <ListItem button onClick={() => handleNavigation("/Parametres")}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
            </ListItem>
          </Tooltip>
        </Box>
      </List>
    </Drawer>
  );
};

export default Sidebar;
