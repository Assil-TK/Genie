import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Tooltip
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import CommentIcon from '@mui/icons-material/Comment';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

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
          backgroundColor: '#f7f7f7', // clear gray
          overflowX: "hidden",
          transition: "none"
        },
      }}
    >
      <List sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: '64px' }}>
        {[
          { text: "Repositories", icon: <GitHubIcon />, path: "/RepoExplorer" },
          { text: "Deployer", icon: <CloudUploadIcon />, path: "/deploygit" },
          { text: "Avis", icon: <CommentIcon />, path: "/admin/avis" },
        ].map((item, index) => (
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
