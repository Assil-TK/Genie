import React, { useState, useEffect } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, CircularProgress, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import PreviewIcon from "@mui/icons-material/Visibility";
import { fetchPages, getPageVersions, restoreVersion } from "../services/api";
import { createElementFromJson } from "../utils/renderUtils";

const VersionManager = () => {
    const [pages, setPages] = useState([]);
    const [selectedPageId, setSelectedPageId] = useState("");
    const [versions, setVersions] = useState([]);
    const [loadingPages, setLoadingPages] = useState(false);
    const [loadingVersions, setLoadingVersions] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewContent, setPreviewContent] = useState(null);

    useEffect(() => {
        const loadPages = async () => {
            setLoadingPages(true);
            try {
                const pagesList = await fetchPages();
                setPages(pagesList);
            } catch (err) {
                console.error("Erreur chargement pages :", err);
            } finally {
                setLoadingPages(false);
            }
        };

        loadPages();
    }, []);

    useEffect(() => {
        if (!selectedPageId) {
            setVersions([]);
            return;
        }

        const loadVersions = async () => {
            setLoadingVersions(true);
            try {
                const vers = await getPageVersions(selectedPageId);
                setVersions(vers);
            } catch (err) {
                console.error("Erreur chargement versions :", err);
            } finally {
                setLoadingVersions(false);
            }
        };

        loadVersions();
    }, [selectedPageId]);

    const handlePageChange = (e) => {
        setSelectedPageId(e.target.value);
    };

    const handlePreview = (version) => {
        let content = version.content;
        if (typeof content === "string") {
            try {
                content = JSON.parse(content);
            } catch { }
        }
        setPreviewContent(content);
        setPreviewOpen(true);
    };

    const handleRestore = async (version) => {
        try {
            await restoreVersion(selectedPageId, version.id);
            alert("Version restaurée avec succès");
            // recharge les versions
            const updated = await getPageVersions(selectedPageId);
            setVersions(updated);
        } catch (err) {
            console.error("Erreur restauration :", err);
            alert("Échec de la restauration");
        }
    };

    return (
        <Box sx={{ p: 10 }}>
            <Typography variant="h5" sx={{ color: "#F39325", fontFamily: "Poppins" }}>
                Gestion des versions de pages
            </Typography>

            <FormControl fullWidth sx={{ maxWidth: 200, m: 5 }}>
                <InputLabel id="select-page-label">Page</InputLabel>
                <Select
                    labelId="select-page-label"
                    value={selectedPageId}
                    label="Page"
                    onChange={handlePageChange}
                    sx={{ borderRadius: 2 }}
                >
                    {loadingPages ? (
                        <MenuItem disabled>Chargement…</MenuItem>
                    ) : (
                        pages.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name}
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>

            {loadingVersions ? (
                <CircularProgress />
            ) : versions.length === 0 ? (
                <Typography>Aucune version disponible.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Version</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {versions.map((v) => (
                                <TableRow key={v.id}>
                                    <TableCell>{v.id}</TableCell>
                                    <TableCell>
                                        {new Date(v.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            startIcon={<PreviewIcon />}
                                            size="small"
                                            onClick={() => handlePreview(v)}
                                            sx={{ mr: 1 }}
                                        >
                                            Visualiser
                                        </Button>
                                        <Button
                                            startIcon={<RestoreIcon />}
                                            size="small"
                                            color="success"
                                            onClick={() => handleRestore(v)}
                                        >
                                            Restaurer
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Visualisation de la version</DialogTitle>
                <DialogContent dividers>
                    {previewContent ? (
                        Array.isArray(previewContent) ? (
                            previewContent.map((el, idx) =>
                                createElementFromJson(el, `ver-preview-${idx}`)
                            )
                        ) : (
                            createElementFromJson(previewContent, "ver-preview")
                        )
                    ) : (
                        <Typography>Aucun contenu à afficher</Typography>
                    )}
                </DialogContent>
                <DialogActions>
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
                    }} onClick={() => setPreviewOpen(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VersionManager;