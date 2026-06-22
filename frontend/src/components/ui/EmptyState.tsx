import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
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
}
