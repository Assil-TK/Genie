import React, { useState, useEffect } from "react";
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Typography,
  Alert,
  Snackbar
} from "@mui/material";
import { Edit, Delete, GroupAdd } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {getAdmins, createAdmin, updateAdmin, deleteAdmin } from "../services/api";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  const loadAdmins = async () => {
    setLoading(true);
    try {
      setAdmins(await getAdmins());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAdmins(); }, []);

  const handleOpenCreate = () => {
    setEditAdmin(null);
    setForm({ username: "", email: "", password: "" });
    setDialogOpen(true);
  };
  const handleOpenEdit = (admin) => {
    setEditAdmin(admin);
    setForm({ username: admin.username, email: admin.email, password: "" });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editAdmin) {
        await updateAdmin(editAdmin.id, {
          username: form.username,
          email: form.email,
          isApproved: true,
        });
      } else {
        await createAdmin({ ...form });
      }
  
      setSnackbar({
        open: true,
        message: editAdmin ? "Compte modifié avec succès" : "Admin créé avec succès",
        severity: "success",
      });
  
      setDialogOpen(false);
      loadAdmins();
    } catch (error) {
      const message = error.response?.data?.message || "Echec , verifier les données";
      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    }
  };
  

  const handleDelete = async (id) => {
    const confirmation = window.confirm("Supprimer cet admin ?");
    if (!confirmation) {
      return; 
    }
  
    try {
      await deleteAdmin(id);
      setSnackbar({
        open: true,
        message: "Admin supprimé avec succès",
        severity: "success",
      });
      loadAdmins();
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de la suppression";
      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    }
  };
  

  return (
    <Box sx={{p:10}}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" sx={{ color: "#F39325", fontFamily: "Poppins" }}>Gestion des Admins</Typography>
        <Box>
          <Button variant="contained" sx={{
                        backgroundColor: "#F5F5F5",
                        color: "#000",
                        borderColor: "#1B374C",
                        height: "40px",
                        borderRadius: 5,
                        "&:active": {
                            backgroundColor: "#F39325",
                            color: "#FFF",
                            borderColor: "#1B374C",
                        },
                        mr:2
                    }}  onClick={handleOpenCreate}>
            Nouvel Admin
          </Button>
          <Button variant="contained" sx={{
                        backgroundColor: "#F5F5F5",
                        color: "#000",
                        borderColor: "#1B374C",
                        height: "40px",
                        borderRadius: 5,
                        "&:active": {
                            backgroundColor: "#1B374C",
                            color: "#FFF",
                            borderColor: "#1B374C",
                        },
                    }} onClick={() => navigate("/admins/pending")}>
            En attente
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Admin</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && admins.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.username}</TableCell>
                <TableCell>{a.email}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenEdit(a)}><Edit/></IconButton>
                  <IconButton onClick={() => handleDelete(a.id)} color="error"><Delete/></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editAdmin ? "Modifier Admin" : "Nouveau Admin"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Username" fullWidth margin="dense"
            value={form.username}
            onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
          />
          <TextField
            label="Email" fullWidth margin="dense"
            value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
          />
          {!editAdmin && (
            <TextField
              label="Password" type="password" fullWidth margin="dense"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit}>{editAdmin ? "Enregistrer" : "Créer"}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminList;
