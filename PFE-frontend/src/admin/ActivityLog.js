import React, { useEffect, useState } from "react";
import { getMyOperations } from "../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import { keyframes } from "@mui/material/styles";

// Animated gradient background keyframes
const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ActivityLog = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getMyOperations();
        console.log("Données récupérées:", data);
        setHistory(data);
      } catch (err) {
        console.error("Erreur :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Animated gradient background */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, rgb(189, 200, 227), rgb(201, 209, 221), rgb(232, 220, 213))',
          backgroundSize: '400% 400%',
          animation: `${gradientBG} 15s ease infinite`,
          zIndex: -1,
        }}
      />

      {/* Page content */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          px: 2,
          py: 7,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 6,
            borderRadius: 4,
            width: '400%',
            maxWidth: 4000,
            bgcolor: 'rgba(255, 255, 255, 0.88)',
            textAlign: 'center',
            marginTop: '0.5rem',
            marginLeft: '2.8rem',
            marginRight: '-1rem',
            overflow: 'auto',
          }}
        >
          <Typography
                      variant="h4"
                      sx={{
                        color: "#F39325",
                        fontFamily: "Poppins",
                        mb: 8,
                        fontWeight: "bold",
                        textAlign: "center"
                      }}
                    >
            Mon journal d’activité
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: "Poppins", color: "#4E709D" }}>
                      <strong>Type</strong>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins", color: "#4E709D" }}>
                      <strong>Page</strong>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Poppins", color: "#4E709D" }}>
                      <strong>Date</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(history) && history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Aucune activité trouvée.
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((mod) => (
                      <TableRow key={mod.id}>
                        <TableCell>
                          {mod.operationType === "creation" && "Création"}
                          {mod.operationType === "modification" && "Modification"}
                        </TableCell>
                        <TableCell>{mod.fileName || "Fichier inconnu"}</TableCell>
                        <TableCell>
                          {dayjs(mod.createdAt).format("DD/MM/YYYY HH:mm")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ActivityLog;
