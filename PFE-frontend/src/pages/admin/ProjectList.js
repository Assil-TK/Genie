import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, CircularProgress,
  Box
} from "@mui/material";
import { downloadProject, getAllProjects } from "../../services/api";
import { format } from "date-fns";

const ProjectDownload = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projets = await getAllProjects();
        setProjects(projets);
      } catch (error) {
        console.error("Erreur lors de la récupération des projets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDownload = (projectId) => {
    downloadProject(projectId);
  };

  return (
    <Box sx={{ p: 10 }}>
      <Typography variant="h5" sx={{ color: "#F39325", fontFamily: "Poppins", mb: 3 }}>Télécharger un projet</Typography>

      {loading ? (
        <CircularProgress />
      ) : projects.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom du projet</TableCell>
                <TableCell>Dernière modification</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    {project.updatedAt
                      ? format(new Date(project.updatedAt), "dd/MM/yyyy HH:mm")
                      : "Non disponible"}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDownload(project.id)}
                    >
                      Télécharger
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Aucun projet trouvé.</Typography>
      )}
    </Box>
  );
};

export default ProjectDownload;
