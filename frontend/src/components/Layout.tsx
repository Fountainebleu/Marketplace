import {
  AppBar,
  Badge,
  Box,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

export function Layout() {
  const { totalItems } = useCart();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 72 }}>
            <Stack
              component={RouterLink}
              to="/"
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                M
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                  Marketplace
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Доставка по всей стране
                </Typography>
              </Box>
            </Stack>

            <IconButton
              component={RouterLink}
              to="/cart"
              aria-label="Корзина"
              sx={{
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                '&:hover': { bgcolor: 'background.default', borderColor: 'primary.light' },
              }}
            >
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: { xs: 3, md: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
