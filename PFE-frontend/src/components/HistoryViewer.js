import React, { useEffect, useState } from "react";
import { getAllOperations } from "../services/api";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, TextField, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const HistoryViewer = () => {
  const [history, setHistory] = useState([]);
  const [pageFilter, setPageFilter] = useState("");
  const [operationFilter, setOperationFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getAllOperations();
        setHistory(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique :", error);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((mod) => {
    const fileName = mod.fileName || "";
    const operationType = mod.operationType || "";
    const username = mod.username || "";

    return (
      fileName.toLowerCase().includes(pageFilter.toLowerCase()) &&
      (operationFilter === "" || operationType === operationFilter) &&
      username.toLowerCase().includes(userFilter.toLowerCase())
    );
  });

  return (
    <Paper sx={{ ml: 5, p: 2 }}>
      
      <FormControl sx={{ mr: 2, minWidth: 150 }}>
        <InputLabel id="operation-filter-label">Opération</InputLabel>
        <Select
          labelId="operation-filter-label"
          value={operationFilter}
          label="Opération"
          onChange={(e) => setOperationFilter(e.target.value)}
        >
          <MenuItem value="">Tous</MenuItem>
          <MenuItem value="creation">Création</MenuItem>
          <MenuItem value="modification">Modification</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ mr: 2, minWidth: 150 }}>
        <TextField
          label="Utilisateur"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        />
      </FormControl>
      <FormControl sx={{ mr: 2, minWidth: 150 }}>
        <TextField
          label="Nom de la page"
          value={pageFilter}
          onChange={(e) => setPageFilter(e.target.value)}
        />
      </FormControl>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Opération</TableCell>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Page</TableCell>
              <TableCell>Date</TableCell>
              {/* <TableCell align="center">Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Aucune opération trouvée.</TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((mod) => (
                <TableRow key={mod.id}>
                  <TableCell>{mod.operationType}</TableCell>
                  <TableCell>{mod.username}</TableCell>
                  <TableCell>{mod.fileName}</TableCell>
                  <TableCell>{new Date(mod.createdAt).toLocaleString()}</TableCell>
                  {/* <TableCell align="center">
                    {/* Actions, tu peux activer si tu veux */}
                    {/* <IconButton color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton> 
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default HistoryViewer;
