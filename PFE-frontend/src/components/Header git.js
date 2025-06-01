import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import GitHubIcon from "@mui/icons-material/GitHub";
import React from "react";
import { logOut } from "../services/api";

const Header = ({ toggleSidebar }) => {
    const handleLogout = () => {
        logOut();
    };

    const handleGithubLogin = () => {
        window.location.href = 'http://localhost:5010/auth/github'; // GitHub OAuth URL
    };

    return (
        <AppBar position="fixed" sx={{ backgroundColor: "#1B374C", width: "100%", zIndex: 1201 }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "Poppins" }}>
                    GenieAI
                </Typography>

                
                <IconButton color="inherit" onClick={handleLogout} aria-label="logout" sx={{ marginLeft: 2 }}>
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
