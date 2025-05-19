import { Card, Box, Typography, Grid } from "@mui/material";
import DashboardStats from "../components/DashboardStats";
import DashboardComparatif from "../components/DashboardComparatif";
import DashboardHourlyChart from "../components/DashboardHourlyChart";

const DashboardContent = () => {
    return (
        <Box sx={{ width: "100%", px: 3, py: 2, ml: 5, mr: 3, mt: 5, backgroundColor: "#fafafa", }}>
            <Typography
                variant="h4"
                sx={{ mb: 3, textAlign: "center", color: "#F39325", fontWeight: 600, fontFamily: "Poppins" }}>
                Tableau de bord
            </Typography>

            {/* Ligne 1 : Globales + Comparatif */}
            <Grid container spacing={2}>
                {/* Colonne Gauche */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Card sx={{ flex: 1, px: 2, py: 1.5, boxShadow: 2, borderRadius: 2, mb: 2 }}>
                            <DashboardStats />
                        </Card>
                        <Card sx={{ flex: 1, px: 2, py: 1.5, boxShadow: 2, borderRadius: 2 }}>
                            <DashboardHourlyChart />
                        </Card>
                    </Box>
                </Grid>

                {/* Colonne Droite */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', px: 2, py: 1.5, boxShadow: 2, borderRadius: 2, minHeight: 640 }}>
                        <DashboardComparatif />
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardContent;

