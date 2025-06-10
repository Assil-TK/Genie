import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, CircularProgress, Box, Chip, Link, Snackbar, Alert
} from "@mui/material";
import { getProjectsWithDeploymentInfo, deployProject } from "../../services/api";
import { format } from "date-fns";
import { keyframes } from '@mui/material/styles';

const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ProjectDeploy = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const projets = await getProjectsWithDeploymentInfo();
      setProjects(projets);
    } catch (error) {
      console.error("Erreur lors de la récupération des projets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeploy = async (userId, projectName) => {
    setDeploying((prev) => ({ ...prev, [projectName]: true }));
    try {
      await deployProject(userId, projectName);
      setSnackbar({ open: true, message: "Déploiement effectué !", severity: "success" });
      fetchProjects();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur de déploiement : " + (error.message || "inconnue"),
        severity: "error"
      });
    } finally {
      setDeploying((prev) => ({ ...prev, [projectName]: false }));
    }
  };

  const renderStatusChip = (status) => {
    switch (status) {
      case "pending":
        return <Chip label="En cours" color="warning" />;
      case "success":
        return <Chip label="Succès" color="success" />;
      case "error":
        return <Chip label="Erreur" color="error" />;
      default:
        return <Chip label="Inconnu" />;
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Animated gradient background fixed and full screen */}
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

      {/* Main content container */}
      <Box sx={{ p: 10, position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ color: "#F5B17B", fontFamily: "Poppins", mb: 3 }}
        >
          Déployer un projet
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : projects.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: "Poppins", color: "#4E709D" }}><strong>Nom du projet</strong></TableCell>
                  <TableCell sx={{ fontFamily: "Poppins", color: "#4E709D" }}><strong>Dernière modification</strong></TableCell>
                  <TableCell sx={{ fontFamily: "Poppins", color: "#4E709D" }}><strong>Statut du déploiement</strong></TableCell>
                  <TableCell sx={{ fontFamily: "Poppins", color: "#4E709D" }}><strong>URL déployée</strong></TableCell>
                  <TableCell sx={{ fontFamily: "Poppins", color: "#4E709D" }} align="right"><strong>Action</strong></TableCell>
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
                    <TableCell>{renderStatusChip(project.deploymentStatus)}</TableCell>
                    <TableCell>
                      {project.deploymentStatus === "success" && project.vercelUrl ? (
                        <Link
                          href={project.vercelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                        >
                          Voir site
                        </Link>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        disabled={deploying[project.name]}
                        sx={{ backgroundColor: "#89A4C7", color: "black", fontFamily: "Poppins" }}
                        onClick={() => handleDeploy(project.userId, project.name)}
                      >
                        {deploying[project.name] ? "Déploiement..." : "Déployer"}
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

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            sx={{ width: "100%", fontFamily: "Poppins" }}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ProjectDeploy;
