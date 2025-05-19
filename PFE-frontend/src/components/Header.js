import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import  MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import {logOut} from '../services/api'
const Header = ({toggleSidebar}) => {
    const handleLogout = () => {
        logOut(); 
    };
    return (
       
        <AppBar position="fixed" sx={{ backgroundColor : "#1B374C", width: "100%", zIndex: 1201}}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow:1, fontFamily: 'poppins' }}>
                    EFFIA
                </Typography>
                <IconButton color="inherit">
                    <NotificationsIcon/>
                </IconButton>
                <IconButton color="inherit" onClick={handleLogout}>
                    <LogoutIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};
export default Header;