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
                    EFFIA
                </Typography>

                {/* GitHub Hover Button */}
                <Box
                    onClick={handleGithubLogin}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                        backgroundColor: "#1B374C",
                        color: "white",
                        border: "1.5px solid white",
                        borderRadius: "20px",
                        cursor: "pointer",
                        transition: "width 0.3s ease, padding 0.3s ease",
                        width: "40px",
                        padding: "5px 8px",
                        "&:hover": {
                            width: "220px",
                            padding: "5px 12px",
                        },
                    }}
                >
                    <GitHubIcon sx={{ marginRight: "6px", fontSize: "20px" }} />
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: "Poppins",
                            fontSize: "0.8rem",
                            whiteSpace: "nowrap",
                            opacity: 0,
                            transition: "opacity 0.2s ease 0.1s",
                            "&:hover": {
                                opacity: 1,
                            },
                        }}
                    >
                        Se connecter avec GitHub
                    </Typography>
                </Box>

                <IconButton color="inherit" onClick={handleLogout} aria-label="logout" sx={{ marginLeft: 2 }}>
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
