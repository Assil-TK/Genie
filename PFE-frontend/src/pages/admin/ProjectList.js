import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, CircularProgress, Box
} from "@mui/material";
import { format } from "date-fns";
import { downloadProject, getAllProjects } from "../../services/api";
import { keyframes } from "@mui/material/styles";

// Animated background
const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

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
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Animated background */}
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
            p: 9,
            borderRadius: 4,
            width: '100%',
            maxWidth: 1250,
            ml:'3.5rem',
            bgcolor: 'rgba(255, 255, 255, 0.88)',
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
            Télécharger un projet
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : projects.length > 0 ? (
            <TableContainer component={Paper} elevation={0}>
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
            <Typography textAlign="center">Aucun projet trouvé.</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ProjectDownload;
