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
import React from "react";
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Sidebar = ({ open }) => {
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
      open={open}
      sx={{
        width: open ? 240 : 60,
        flexShrink: 0,
        transition: "width 0.3s ease",
        position: 'fixed',
        zIndex: 1200,
        height: "calc(100vh - 64px)",
        "& .MuiDrawer-paper": {
          width: open ? 240 : 60,
          transition: "width 0.3s ease",
          overflowX: "hidden",
        },
      }}
    >
      <List sx={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: '64px' }}>
        {[
          { text: "Repositories", icon: <GitHubIcon />, path: "/RepoExplorer" },
          { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/tableau" },
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
