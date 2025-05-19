import React, { useEffect, useState } from 'react';
import { getAllStats } from '../services/api'; 
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider
} from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardStats = () => {
  const [stats, setStats] = useState([]);
  const [filterType, setFilterType] = useState('global');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let params = {};
        if ((filterType === 'jour' || filterType === 'mois') && startDate && endDate) {
          params.startDate = startDate;
          params.endDate = endDate;
        }
        const data = await getAllStats(params);
        setStats(data); // Attention, ici data est un tableau maintenant
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      }
    };

    fetchStats();
  }, [filterType, startDate, endDate]);

  const visitsChartData = {
    labels: stats.map(item => item.pageName),
    datasets: [
      {
        label: "Nombre de visites",
        data: stats.map(item => parseInt(item.visitCount || 0, 10)),
        backgroundColor: "#42A5F5",
      },
    ],
  };

  const durationChartData = {
    labels: stats.map(item => item.pageName),
    datasets: [
      {
        label: "Durée totale (s)",
        data: stats.map(item => parseInt(item.totalDuration || 0, 10)),
        backgroundColor: "#26A69A",
      },
    ],
  };

  const averageDurationChartData = {
    labels: stats.map(item => item.pageName),
    datasets: [
      {
        label: "Durée moyenne (s)",
        data: stats.map(item => parseFloat(item.averageDuration || 0).toFixed(0)),
        backgroundColor: "#FF9800",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Typography variant="h6" fontWeight={600} fontFamily="poppins" mb={3} align="center" sx={{ color: "#1976D2" }}>
        Statistiques par Page
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Type de filtre</InputLabel>
          <Select
            value={filterType}
            label="Type de filtre"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="global">Global</MenuItem>
            <MenuItem value="jour">Par jour</MenuItem>
            <MenuItem value="mois">Par mois</MenuItem>
          </Select>
        </FormControl>

        {(filterType === 'jour' || filterType === 'mois') && (
          <>
            <TextField
              size="small"
              label="Date de début"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <TextField
              size="small"
              label="Date de fin"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Nombre de visites par page
        </Typography>
        {stats.length > 0 ? (
          <Bar data={visitsChartData} options={chartOptions} />
        ) : (
          <Typography variant="body2">Aucune donnée disponible pour ces paramètres.</Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Durée totale par page (en secondes)
        </Typography>
        {stats.length > 0 ? (
          <Bar data={durationChartData} options={chartOptions} />
        ) : (
          <Typography variant="body2">Aucune donnée disponible pour ces paramètres.</Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Durée moyenne par page (en secondes)
        </Typography>
        {stats.length > 0 ? (
          <Bar data={averageDurationChartData} options={chartOptions} />
        ) : (
          <Typography variant="body2">Aucune donnée disponible pour ces paramètres.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default DashboardStats;
