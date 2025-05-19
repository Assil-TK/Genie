import { Box, IconButton, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const HistoriqueHeader = () => (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" >Historique</Typography>
        <IconButton>
            <FilterListIcon/>
        </IconButton>
    </Box>
);
export default HistoriqueHeader;