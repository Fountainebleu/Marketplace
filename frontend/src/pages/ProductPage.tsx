import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { CATEGORY_LABELS } from '@/constants/categories';
import { useCart } from '@/context/CartContext';
import { getProductById } from '@/services/productService';
import { formatPrice } from '@/theme';
import { Product } from '@/types/product';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return <Alert severity="warning" sx={{ borderRadius: 3 }}>Товар не найден</Alert>;
  }

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        imageUrl: product.imageUrl,
      },
      quantity,
    );
    setAdded(true);
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" underline="hover" color="text.secondary">
          Каталог
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: { xs: 2, md: 3 }, overflow: 'hidden' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Box
            sx={{
              flex: 1,
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: 'grey.100',
              maxHeight: 420,
            }}
          >
            <Box
              component="img"
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              sx={{ width: '100%', height: '100%', maxHeight: 420, objectFit: 'cover' }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack spacing={2.5}>
              <Chip label={CATEGORY_LABELS[product.category]} sx={{ alignSelf: 'flex-start' }} />
              <Typography variant="h4" fontWeight={700}>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Артикул: {product.sku}
              </Typography>
              <Typography variant="h4" color="primary.main" fontWeight={700}>
                {formatPrice(product.price)}
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                {product.description}
              </Typography>

              <Divider />

              <Stack spacing={1.5}>
                {product.manufacturerCountry && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PublicOutlinedIcon fontSize="small" color="action" />
                    <Typography variant="body2">Страна: {product.manufacturerCountry}</Typography>
                  </Stack>
                )}
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Inventory2OutlinedIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {product.length}×{product.width}×{product.height} см · {product.weight} кг
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocalShippingOutlinedIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Доставка 1–3 рабочих дня
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                <TextField
                  label="Количество"
                  type="number"
                  size="small"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  inputProps={{ min: 1 }}
                  sx={{ width: 120 }}
                />
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={handleAddToCart}
                  sx={{ flex: 1 }}
                >
                  В корзину
                </Button>
                <Button variant="outlined" size="large" onClick={() => navigate('/checkout')}>
                  Заказать
                </Button>
              </Stack>

              {added && (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  Товар добавлен в корзину.{' '}
                  <Link component={RouterLink} to="/cart">
                    Перейти в корзину
                  </Link>
                </Alert>
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
