import { alpha, createTheme, type Shadows } from '@mui/material/styles';

const primary = '#6366f1';
const primaryDark = '#4f46e5';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primary,
      dark: primaryDark,
      light: '#818cf8',
    },
    secondary: {
      main: '#f59e0b',
    },
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: alpha('#0f172a', 0.08),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(15, 23, 42, 0.04)',
    '0 4px 12px rgba(15, 23, 42, 0.06)',
    '0 8px 24px rgba(15, 23, 42, 0.08)',
    ...Array(21).fill('0 8px 24px rgba(15, 23, 42, 0.08)'),
  ] as Shadows,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: 'antialiased',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 20px',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${primaryDark} 0%, #4338ca 100%)`,
          },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${alpha('#0f172a', 0.08)}`,
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        rounded: {
          border: `1px solid ${alpha('#0f172a', 0.08)}`,
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#fff',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
        filled: {
          backgroundColor: alpha(primary, 0.1),
          color: primaryDark,
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

export const cardHoverSx = {
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.1)',
    borderColor: alpha(primary, 0.3),
  },
};

export default theme;
