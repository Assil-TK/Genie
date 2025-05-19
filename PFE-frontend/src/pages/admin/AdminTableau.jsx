import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { getDashboardStats } from '../../services/api';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

const AdminTableau = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Chargement...</div>;

  return (
    <Box sx={{ p: 10 }}>
      <Grid container spacing={3}>
        {/* Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">Utilisateurs inscrits</Typography>
              <Typography variant="h5" color="primary">{stats.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">Projets uploadés</Typography>
              <Typography variant="h5" color="primary">{stats.totalProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">Nombre d'avis</Typography>
              <Typography variant="h5" color="primary">{stats.totalAvis}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">Note moyenne</Typography>
              <Typography variant="h5" color="primary">{parseFloat(stats.averageNote).toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>Connexions récentes</Typography>
              <LineChart width={450} height={250} data={stats.logins.map(l => ({
                day: l.day,
                count: parseInt(l.count)
              }))}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>Opérations</Typography>
              <BarChart width={450} height={250} data={stats.operations.map(op => ({
                day: op.day,
                creation: op.operationType === 'creation' ? parseInt(op.count) : 0,
                modification: op.operationType === 'modification' ? parseInt(op.count) : 0
              }))}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="creation" fill="#82ca9d" />
                <Bar dataKey="modification" fill="#8884d8" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminTableau;