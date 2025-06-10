import { Box, Typography, Paper } from '@mui/material';
import CreatePageForm from '../../components/CreatePageForm';
import { keyframes } from '@mui/material/styles';

// Animated gradient background keyframes
const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function AdminCreatePage() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Animated gradient background */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, rgb(189, 200, 227), rgb(201, 209, 221), rgb(232, 220, 213))',
          backgroundSize: '400% 400%',
          animation: `${gradientBG} 15s ease infinite`,
          zIndex: -1,
        }}
      />

      {/* Page content */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          px: 2,
          py: 7, // vertical padding
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 6, // internal padding
            borderRadius: 4, // round corners
            width: '400%', // % of the page width (change as needed)
            maxWidth: 4000, // maximum width (set to control how large it can get)
            height: 'auto', // change to '600px' or '80vh' for fixed height
            bgcolor: 'rgba(255, 255, 255, 0.88)', // changed background color to light gray
            textAlign: 'center',
            marginTop: '0.5rem',
            marginLeft: '2.8rem',
            marginRight: '-1rem',
            overflow: 'auto', // if content overflows, scroll
          }}
        >
          <Typography
            variant='h4'
            sx={{
              fontFamily: 'Fira Sans, sans-serif',
              color: '#ff9800',
              fontWeight: 'bold',
              marginBottom: '2rem',
              fontSize: '2.8rem',
            }}
          >
            Créer une nouvelle page
          </Typography>

          <CreatePageForm />
        </Paper>
      </Box>
    </Box>
  );
}
