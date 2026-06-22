import { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';

const Loader: FC<{ text?: string }> = ({ text }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
    <CircularProgress />
    {text && (
      <Box component="span" sx={{ color: 'text.secondary', fontSize: 14 }}>
        {text}
      </Box>
    )}
  </Box>
);

export default Loader;
