import { Box, CircularProgress } from '@mui/material';

export const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
    <CircularProgress />
  </Box>
);
