import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Snackbar, Alert, Box } from "@mui/material";
import { approveClient } from "../services/api";

const API_URL = "http://localhost:5000"; 

const PendingAdmins = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchPendingAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/clients/pending`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      setPendingAdmins(response.data);
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors du chargement", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveClient(id);
      setSnackbar({ open: true, message: "Client approuvé avec succès", severity: "success" });
      setPendingAdmins((prev) => prev.filter((client) => client.id !== id));
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de l'approbation", severity: "error" });
    }
  };

  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  return (
    <Box sx={{backgroundColor: "#CDD5E0", minHeight: "100vh"}}>
    <Paper sx={{ padding: 3, marginTop: 10, marginLeft: 8, marginRight:2 }}>
      <Typography variant="h4" color="#1B374C" align='center' sx={{ fontFamily: "Poppins", mb: 3 }}>
        Comptes clients en attente d'approbation
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : pendingAdmins.length === 0 ? (
        <Typography>Aucun compte en attente.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: "Poppins", color:"#F5B17B" }}>Nom d'utilisateur</TableCell>
                <TableCell sx={{ fontFamily: "Poppins", color:"#F5B17B" }}>Email</TableCell>
                <TableCell sx={{ fontFamily: "Poppins", color:"#F5B17B" }}>Date d'inscription</TableCell>
                <TableCell sx={{ fontFamily: "Poppins", color:"#F5B17B" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.username}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApprove(admin.id)}
                    >
                      Approuver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
    </Box>
  );
};

export default PendingAdmins;
