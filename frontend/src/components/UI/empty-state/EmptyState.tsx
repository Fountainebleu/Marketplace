import { FC, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface IEmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const EmptyState: FC<IEmptyStateProps> = ({ title, description, icon, action }) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 10,
      px: 3,
      borderRadius: 4,
      bgcolor: 'background.paper',
      border: 1,
      borderColor: 'divider',
    }}
  >
    {icon}
    <Typography variant="h6" fontWeight={700} gutterBottom>
      {title}
    </Typography>
    {description && (
      <Typography color="text.secondary" mb={action ? 3 : 0}>
        {description}
      </Typography>
    )}
    {action}
  </Box>
);

export default EmptyState;
