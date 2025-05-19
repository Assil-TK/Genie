import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import { approveAdmin } from "../services/api";

const API_URL = "http://localhost:5000"; 

const PendingAdmins = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchPendingAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/profils/admins/pending`,
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
      await approveAdmin(id);
      setSnackbar({ open: true, message: "Admin approuvé avec succès", severity: "success" });
      setPendingAdmins((prev) => prev.filter((admin) => admin.id !== id));
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de l'approbation", severity: "error" });
    }
  };

  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  return (
    <Paper sx={{ padding: 3, marginTop: 10, marginLeft: 8 }}>
      <Typography variant="h5" gutterBottom color="#F39325">
        Comptes Admins en attente d'approbation
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
                <TableCell>Nom d'utilisateur</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Date d'inscription</TableCell>
                <TableCell>Action</TableCell>
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
  );
};

export default PendingAdmins;
