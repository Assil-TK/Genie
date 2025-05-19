import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, CircularProgress, Box, Chip, Link
} from "@mui/material";
import { getProjectsWithDeploymentInfo, deployProject } from "../../services/api";
import { format } from "date-fns";

const ProjectDeploy = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState({});

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
      alert("Déploiement effectué !");
      fetchProjects();
    } catch (error) {
      alert("Erreur de déploiement : " + (error.message || "inconnue"));
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
    <Box sx={{ p: 10 }}>
      <Typography variant="h5" sx={{ color: "#F39325", fontFamily: "Poppins", mb: 3 }}>
        Déployer un projet
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : projects.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom du projet</TableCell>
                <TableCell>Dernière modification</TableCell>
                <TableCell>Statut du déploiement</TableCell>
                <TableCell>URL déployée</TableCell>
                <TableCell align="right">Action</TableCell>
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
                      variant="contained"
                      color="success"
                      disabled={deploying[project.name]}
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
    </Box>
  );
};
export default ProjectDeploy;
