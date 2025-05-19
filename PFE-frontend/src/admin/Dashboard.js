import { Box } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import DashboardContent from "./DashboardContent";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header toggleSidebar={toggleSidebar} sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }} />

            <Box sx={{ display: "flex", flexGrow: 1, marginTop: "64px" }}>
                <Sidebar open={sidebarOpen} />
                <Box
                    sx={{
                        flexGrow: 1,
                        transition: "margin-left 0.3s ease, width 0.3s ease",
                        marginLeft: sidebarOpen ? "240px" : "60px", 
                        width: `calc(100% - ${sidebarOpen ? 240 : 60}px)`, 
                        padding: 3
                    }}
                >
                    <DashboardContent />
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
