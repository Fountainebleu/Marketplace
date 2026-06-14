import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/theme';

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
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
        <ShoppingBagOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Корзина пуста
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Добавьте товары из каталога
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" size="large">
          Перейти в каталог
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Корзина
      </Typography>
      <Typography color="text.secondary" mb={3}>
        {items.length} {items.length === 1 ? 'товар' : items.length < 5 ? 'товара' : 'товаров'}
      </Typography>

      <Stack spacing={2} mb={3}>
        {items.map((item) => (
          <Paper key={item.productId} sx={{ p: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
              {item.imageUrl && (
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.productName}
                  sx={{
                    width: 88,
                    height: 88,
                    objectFit: 'cover',
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={600} gutterBottom>
                  {item.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatPrice(item.unitPrice)} за шт.
                </Typography>
              </Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <TextField
                  type="number"
                  size="small"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                  inputProps={{ min: 1 }}
                  sx={{ width: 72 }}
                />
                <Typography fontWeight={700} minWidth={90} textAlign="right">
                  {formatPrice(item.unitPrice * item.quantity)}
                </Typography>
                <IconButton
                  aria-label="Удалить"
                  onClick={() => removeItem(item.productId)}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="text.secondary" variant="body2">
              Итого к оплате
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {formatPrice(totalPrice)}
            </Typography>
          </Box>
          <Button variant="contained" size="large" onClick={() => navigate('/checkout')}>
            Оформить заказ
          </Button>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" color="text.secondary">
          Доставка рассчитывается при оформлении
        </Typography>
      </Paper>
    </Box>
  );
}
