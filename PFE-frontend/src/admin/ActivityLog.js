import React, { useEffect, useState } from "react";
import { getMyOperations } from "../services/api";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Box } from "@mui/material";
import dayjs from "dayjs";

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
        <Box sx={{ p: 10 }}>
            <Typography variant="h5" sx={{ color: "#F39325", fontFamily: "Poppins" }}> Mon journal d’activité </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>Page</TableCell>
                                <TableCell>Date</TableCell>
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
        </Box>
    );
};

export default ActivityLog;
