import { Suspense } from 'react';
import {
  Box,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { PageLoader } from '@/components/ui/PageLoader';

const DRAWER_WIDTH = 260;

const navItems = [
  { to: '/admin/products', label: 'Товары', icon: Inventory2OutlinedIcon },
  { to: '/admin/orders', label: 'Заказы', icon: ReceiptLongOutlinedIcon },
];

const AdminLayout = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawer = (
    <Box sx={{ py: 2 }}>
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Админка
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Управление магазином
        </Typography>
      </Box>
      <List sx={{ px: 1.5 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const selected = location.pathname.startsWith(item.to);

          return (
            <ListItemButton
              key={item.to}
              component={RouterLink}
              to={item.to}
              selected={selected}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
        <ListItemButton component={RouterLink} to="/" sx={{ borderRadius: 2, mt: 1 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <StorefrontOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="В магазин" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>
      )}

      <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
        {isMobile && (
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              px: 2,
              py: 1.5,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>
                Админка
              </Typography>
              {navItems.map((item) => (
                <Typography
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  variant="body2"
                  sx={{
                    textDecoration: 'none',
                    color: location.pathname.startsWith(item.to) ? 'primary.main' : 'text.secondary',
                    fontWeight: location.pathname.startsWith(item.to) ? 600 : 400,
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}

        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;
