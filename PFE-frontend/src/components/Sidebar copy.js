import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import CommentIcon from '@mui/icons-material/Comment';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(prev => !prev);
  };

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
        width: open ? 240 : 60,
        flexShrink: 0,
        position: 'fixed',
        zIndex: 1200,
        height: "100vh",
        "& .MuiDrawer-paper": {
          width: open ? 190 : 60,
          transition: "width 0.3s ease",
          overflowX: "hidden",
        },
      }}
      onClick={handleToggle} // <- THIS IS THE KEY PART
    >
      <List sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: '64px' }}>
        {[
          { text: "Repositories", icon: <GitHubIcon />, path: "/RepoExplorer" },
          { text: "Deployer", icon: <CloudUploadIcon />, path: "/deploygit" },
          { text: "Avis", icon: <CommentIcon />, path: "/admin/avis" },
        ].map((item, index) => (
          <Tooltip title={!open ? item.text : ""} placement="right" key={index}>
            <ListItem button onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItem>
          </Tooltip>
        ))}

        <Box sx={{ marginTop: 'auto' }}>
          <Tooltip title={!open ? "Paramètres" : ""} placement="right">
            <ListItem button onClick={() => handleNavigation("/Parametres")}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              {open && <ListItemText primary="Paramètres" />}
            </ListItem>
          </Tooltip>
        </Box>
      </List>
    </Drawer>
  );
};

export default Sidebar;
