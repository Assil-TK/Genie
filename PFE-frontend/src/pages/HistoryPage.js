import React from "react";
import HistoryViewer from "../components/HistoryViewer";
import { Box, Typography } from "@mui/material";

const HistoryPage = () => {
  return (
    <Box sx={{ p: 10, backgroundColor: "#CDD5E0" }}>
       <Typography variant="h3" color="#1B374C" align='center' sx={{ fontFamily: "Poppins", mb: 3 }}>Historique de toutes les opérations</Typography>
      <HistoryViewer />
    </Box>
  );
};

export default HistoryPage;