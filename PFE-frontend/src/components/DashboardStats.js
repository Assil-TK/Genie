// DashboardStats.js
import React, { useEffect, useState } from 'react';
import { fetchFileList, getStatsByFile } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';

const DashboardStats = () => {
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const fileList = await fetchFileList();
        setFileList(fileList);
      } catch (err) {
        console.error('Erreur chargement des pages', err);
      }
    }

    fetchFiles();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedFile) return;
      try {
        // Appel à l'API pour récupérer les stats du fichier sélectionné
        const data = await getStatsByFile({ pageName: selectedFile });
        const formatted = data.map((item) => ({
          visitDate: item.visitDate,
          visits: parseInt(item.visits, 10),
        }));
        setStats(formatted);  // Mettre à jour les stats avec les données formatées
      } catch (err) {
        console.error('Erreur récupération stats:', err);
      }
    };
    fetchStats();
  }, [selectedFile]);

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Typography variant="h6" fontWeight={600} fontFamily="poppins" mb={3} align="center" sx={{ color: "#1976D2" }}>
        Statistiques globales de visites par fichier
      </Typography>

      <FormControl size="small" sx={{ mb: 3, minWidth: 140 }}>
        <InputLabel id="file-select-label">Fichier</InputLabel>
        <Select
          labelId="file-select-label"
          value={selectedFile}
          label="Fichier"
          onChange={(e) => setSelectedFile(e.target.value)}
          sx={{ borderRadius: 2 }}
        >
          {fileList.map((file) => (
            <MenuItem key={file.fileName} value={file.fileName}>
              {file.fileName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {stats.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="visitDate" stroke="#888" />
            <YAxis allowDecimals={false} stroke="#888" />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
            <Line type="monotone" dataKey="visits" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Typography variant="body2" sx={{ color: "gray" }}>
          Aucune donnée à afficher pour ce fichier.
        </Typography>
      )}
    </Box>
  );
};

export default DashboardStats;
