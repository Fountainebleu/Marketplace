import { FC } from 'react';
import { Alert, Box, Button } from '@mui/material';

interface IFetchErrorProps {
  text: string;
  isButton?: boolean;
  clickHandler?: () => void;
}

const FetchError: FC<IFetchErrorProps> = ({ text, isButton, clickHandler }) => (
  <Box
    sx={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    }}
  >
    <Box sx={{ textAlign: 'center', maxWidth: 400, px: 2 }}>
      <Alert severity="error" sx={{ mb: isButton ? 2 : 0, borderRadius: 3 }}>
        {text}
      </Alert>
      {isButton && clickHandler && (
        <Button variant="contained" onClick={clickHandler}>
          Повторить
        </Button>
      )}
    </Box>
  </Box>
);

export default FetchError;
