import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Box, CssBaseline } from "@mui/material";
import { useState } from "react";
import './App.css';
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <CssBaseline />
      <AppRoutes toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
    </Box>
  );
}

export default App;
