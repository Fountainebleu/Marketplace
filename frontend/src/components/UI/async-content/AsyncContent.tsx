import { FC, ReactNode } from 'react';
import { Box } from '@mui/material';
import Loader from '@/components/UI/loader/Loader';
import FetchError from '@/components/UI/fetch-error/FetchError';

interface IAsyncContentProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: ReactNode;
  loaderText?: string;
  minHeight?: number;
}

const AsyncContent: FC<IAsyncContentProps> = ({
  loading,
  error,
  onRetry,
  children,
  loaderText = 'Пожалуйста, подождите...',
  minHeight = 200,
}) => (
  <Box sx={{ position: 'relative', minHeight: loading || error ? minHeight : undefined }}>
    <Box
      sx={{
        opacity: loading || error ? 0.2 : 1,
        pointerEvents: loading || error ? 'none' : 'auto',
      }}
    >
      {children}
    </Box>
    {loading && (
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
        <Loader text={loaderText} />
      </Box>
    )}
    {error && (
      <FetchError
        text={error}
        isButton={Boolean(onRetry)}
        clickHandler={onRetry}
      />
    )}
  </Box>
);

export default AsyncContent;
