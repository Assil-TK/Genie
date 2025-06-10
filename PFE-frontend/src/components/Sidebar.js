import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Tooltip
} from "@mui/material";
import {
  Home as HomeIcon,
  Edit as EditIcon,
  Add as AddIcon,
  WorkHistory as WorkHistoryIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  CloudUpload as CloudUploadIcon,
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
          backgroundColor: 'rgba(247, 247, 247, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'none',
        },
      }}
    >
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          marginTop: '75px',
          gap: 1,
        }}
      >
        {menuItems.map((item, index) => (
          <Tooltip title={item.text} placement="right" key={index}>
            <ListItem
              button
              onClick={() => handleNavigation(item.path)}
              sx={{
                justifyContent: 'center',
                paddingY: '6px',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 'auto',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '50%',
                  padding: 1,
                  color: '#444',
                  transition: 'background-color 0.3s, color 0.3s',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    color: '#000',
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
            </ListItem>
          </Tooltip>
        ))}

        <Box sx={{ marginTop: 'auto' }}>
          <Tooltip title="Avis" placement="right">
            <ListItem
              button
              onClick={() => handleNavigation("/admin/avis")}
              sx={{ justifyContent: 'center', paddingY: '6px' }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 'auto',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '50%',
                  padding: 1,
                  color: '#444',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    color: '#000',
                  },
                }}
              >
                <CommentIcon />
              </ListItemIcon>
            </ListItem>
          </Tooltip>
        </Box>
      </List>
    </Drawer>
  );
};

export default Sidebar;
