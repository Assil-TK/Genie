import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, TextField, Button } from '@mui/material';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


import { getDashboardStats } from '../../services/api';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

const AdminTableau = () => {
  const [stats, setStats] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const COLORS = ['#F3D179', '#DCE8BA', '#F46060'];

  const fetchStats = async (start, end) => {
    const formattedStart = start ? start.toISOString().split('T')[0] : undefined;
    const formattedEnd = end ? end.toISOString().split('T')[0] : undefined;
    const data = await getDashboardStats(formattedStart, formattedEnd);
    setStats(data);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return <div>Chargement..</div>;

  return (
    <Box sx={{ p: 10, backgroundColor: "#CDD5E0" }}>
      <Typography variant="h3" color="#1B374C" align='center' sx={{ fontFamily: "Poppins", mb: 3 }}>Dashboard</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#4E709D", boxShadow: 3 }}>
            <CardContent sx={{ textAlign: "center", fontFamily: "Poppins" }}>
              <Typography variant="h6" color="#F5B17B" sx={{ fontFamily: "Poppins" }}>Clients inscrits</Typography>
              <Typography variant="h5" color="#CDD5E0" sx={{ fontFamily: "Poppins" }}>{stats.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#4E709D", boxShadow: 3 }}>
            <CardContent sx={{ textAlign: "center", fontFamily: "Poppins" }}>
              <Typography variant="h6" color="#F5B17B" sx={{ fontFamily: "Poppins" }}>Projets uploadés</Typography>
              <Typography variant="h5" color="#CDD5E0" sx={{ fontFamily: "Poppins" }}>{stats.totalProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#4E709D", boxShadow: 3 }}>
            <CardContent sx={{ textAlign: "center", fontFamily: "Poppins" }}>
              <Typography variant="h6" color="#F5B17B" sx={{ fontFamily: "Poppins" }}>Nombre d'avis</Typography>
              <Typography variant="h5" color="#CDD5E0" sx={{ fontFamily: "Poppins" }}>{stats.totalAvis}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#4E709D", boxShadow: 3 }}>
            <CardContent sx={{ textAlign: "center", fontFamily: "Poppins" }}>
              <Typography variant="h6" color="#F5B17B" sx={{ fontFamily: "Poppins" }}>Note moyenne</Typography>
              <Typography variant="h5" color="#CDD5E0" sx={{ fontFamily: "Poppins" }}>{parseFloat(stats.averageNote).toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Filtres de date */}
        <Grid item xs={12}>
          <Card sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 1,
            my: 2,
            mx: 'auto',
            mt: 3,
            //maxWidth: 800,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#89A4C7"
          }}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item >
                <Typography fontFamily="Poppins">Date de début</Typography>
                <ReactDatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  customInput={<TextField size="small" />}
                  isClearable
                  placeholderText="Sélectionnez une date"
                />
              </Grid>
              <Grid item>
                <Typography fontFamily="Poppins">Date de fin</Typography>
                <ReactDatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  customInput={<TextField size="small" />}
                  isClearable
                  placeholderText="Sélectionnez une date"
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => fetchStats(startDate, endDate)}
                  sx={{ backgroundColor: "#4E709D", fontFamily: "Poppins", mt: 3 }}
                >
                  Appliquer
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ boxShadow: 3, background: "#89A4C7" }}>
            <CardContent sx={{ textAlign: "center", fontFamily: "Poppins" }}>
              <Typography variant="h6" gutterBottom color="#F5B17B" sx={{ fontFamily: "Poppins" }}>Connexions récentes</Typography>
              <LineChart width={380} height={250} data={stats.logins.map(l => ({
                day: l.day,
                count: parseInt(l.count)
              }))}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#7C444F" strokeWidth={2} />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ boxShadow: 3, background: "#89A4C7" }}>
            <CardContent sx={{ textAlign: "center", fontFamily: "Poppins" }}>
              <Typography variant="h6" color="#F5B17B" gutterBottom sx={{ fontFamily: "Poppins" }}>Opérations</Typography>
              <BarChart width={380} height={250} data={stats.operations.map(op => ({
                day: op.day,
                creation: op.operationType === 'creation' ? parseInt(op.count) : 0,
                modification: op.operationType === 'modification' ? parseInt(op.count) : 0
              }))}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="creation" fill="#FFCACC" />
                <Bar dataKey="modification" fill="#DBC4F0" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ boxShadow: 3, background: "#89A4C7" }}>
            <CardContent sx={{ textAlign: "center", fontFamily: "Poppins" }}>
              <Typography variant="h6" color="#F5B17B" gutterBottom sx={{ fontFamily: "Poppins" }}>
                Projets crées
              </Typography>
              <LineChart width={380} height={300} data={stats.projetsByDate.map(p => ({
                date: p.date,
                count: parseInt(p.count)
              }))}>
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6F826A" strokeWidth={3} />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ boxShadow: 3, background: "#89A4C7" }}>
            <CardContent sx={{ textAlign: "center", fontFamily: "Poppins" }}>
              <Typography variant="h6" color="#F5B17B" gutterBottom sx={{ fontFamily: "Poppins" }}>
                Statut des déploiements de projets
              </Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={stats.statusCounts.map((s, index) => ({
                    name: s.deploymentStatus,
                    value: parseInt(s.count)
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  dataKey="value"
                >
                  {stats.statusCounts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminTableau;