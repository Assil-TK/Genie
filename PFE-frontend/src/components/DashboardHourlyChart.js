import React, { useEffect, useState } from "react";
import { getHourlyStatsByPage, fetchFileListDash } from "../services/api"; // Assurez-vous de l'importation correcte
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Select, MenuItem, FormControl, InputLabel, Typography, Box } from "@mui/material";

const DashboardHourlyChart = () => {
  const [data, setData] = useState([]); // Statistiques horaires des visites
  const [files, setFiles] = useState([]); // Liste des fichiers (pages)
  const [selectedFile, setSelectedFile] = useState(""); // Fichier sélectionné pour afficher les stats

  // Charger la liste des fichiers disponibles au démarrage
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const fileList = await fetchFileListDash(); // Récupérer la liste des fichiers
        setFiles(fileList);
        if (fileList.length > 0) setSelectedFile(fileList[0].route); // Par défaut, on sélectionne le premier fichier
      } catch (err) {
        console.error("Erreur lors du chargement des fichiers:", err);
      }
    };
    fetchFiles();
  }, []);

  // Charger les statistiques horaires dès qu'une page est sélectionnée
  useEffect(() => {
    if (!selectedFile) return;

    const fetchHourlyStats = async () => {
      try {
        // Nettoyer selectedFile pour enlever les slashes inutiles
        const cleanFileName = selectedFile.replace(/^\/+|\/+$/g, ''); // Retirer les slashes de début et de fin

        if (!cleanFileName) {
          console.error("Nom de fichier invalide");
          return;
        }

        // Construire l'URL propre
        const url = `http://localhost:5000/visites/hourlyStats/${cleanFileName}`;
        console.log('URL de l\'API:', url);
        
        // Appel à l'API avec l'URL propre
        const stats = await getHourlyStatsByPage(url);

        // Vérifier si les stats sont bien récupérées
        if (!stats || stats.length === 0) {
          console.warn("Aucune donnée de statistiques trouvée pour cette page.");
          return;
        }

        // Formater les données
        const formatted = stats.map(item => ({
          hour: `${item.hour}:00`,
          visits: parseInt(item.visits),
          avgDuration: parseFloat(item.avgDuration).toFixed(1),
        }));

        setData(formatted); // Mettre à jour les données pour le graphique
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques horaires:", err);
      }
    };

    fetchHourlyStats();
  }, [selectedFile]);

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Typography variant="h6" fontWeight={600} fontFamily="poppins" mb={3} align="center" sx={{ color: "#1976D2" }}>
        Horaires des visites par page
      </Typography>

      {/* Sélecteur de fichier */}
      <FormControl size="small" sx={{ mb: 3, minWidth: 140 }}>
        <InputLabel>Page</InputLabel>
        <Select
          value={selectedFile}
          label="Page"
          onChange={(e) => setSelectedFile(e.target.value)}
          sx={{ borderRadius: 2 }}
        >
          {files.map((file) => (
            <MenuItem key={file.route} value={file.route}>
              {file.name} {/* Afficher le nom du fichier */}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Graphique des statistiques horaires */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="visits" stroke="#8884d8" name="Visites" />
          <Line type="monotone" dataKey="avgDuration" stroke="#82ca9d" name="Durée moyenne (s)" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DashboardHourlyChart;
