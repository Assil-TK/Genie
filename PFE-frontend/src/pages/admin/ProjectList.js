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
    <Box sx={{ p: 10, backgroundColor:"#EFEEEA", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" sx={{ color: "#F5B17B", fontFamily: "Poppins", mb: 3 }}>Télécharger un projet</Typography>
      {loading ? (
        <CircularProgress />
      ) : projects.length > 0 ? (
        <Box sx={{ maxWidth: 800, mx: "auto" }}> 
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{color:"#4E709D", fontFamily:"Poppins", width: "33.33%"}}><strong>Nom du projet</strong></TableCell>
                <TableCell sx={{color:"#4E709D", fontFamily:"Poppins", width: "33.33%"}}><strong>Dernière modification</strong></TableCell>
                <TableCell align="right" sx={{color:"#4E709D", fontFamily:"Poppins", width: "33.33%"}}><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell sx={{width: "33.33%"}}>{project.name}</TableCell>
                  <TableCell sx={{width: "33.33%"}}>
                    {project.updatedAt
                      ? format(new Date(project.updatedAt), "dd/MM/yyyy HH:mm")
                      : "Non disponible"}
                  </TableCell>
                  <TableCell align="right" sx={{width: "33.33%"}}>
                    <Button
                     sx={{backgroundColor:"#89A4C7", color:"black", fontFamily:"Poppins"}}
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
        </Box> 
      ) : (
        <Typography sx={{fontFamily:"Poppins"}}>Aucun projet trouvé.</Typography>
      )}
    </Box>
  );
};

export default ProjectDownload;