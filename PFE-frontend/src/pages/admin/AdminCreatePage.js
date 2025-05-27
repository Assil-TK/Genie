import { Box, Typography } from '@mui/material';
import CreatePageForm from '../../components/CreatePageForm';

export default function AdminCreatePage() {
  return (
    <Box sx={{p:10, textAlign:'center'}}>
      <Typography variant='h4'sx={{fontFamily: 'Fira Sans, sans-serif',
              color: '#ff9800',
              fontWeight: 'bold' ,
              textAlign: 'center',
              marginBottom: '2rem',
              fontSize: '2.8rem',
              marginTop: '4%'}}>Créer une nouvelle page</Typography>
      <CreatePageForm />
    </Box>
  );
}
