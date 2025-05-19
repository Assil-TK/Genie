import { Box, Typography } from '@mui/material';
import CreatePageForm from '../../components/CreatePageForm';

export default function AdminCreatePage() {
  return (
    <Box sx={{p:10, textAlign:'center'}}>
      <Typography variant='h4'sx={{fontFamily:'Poppins',color:'#F39325'}}>Ajouter une nouvelle page</Typography>
      <CreatePageForm />
    </Box>
  );
}
