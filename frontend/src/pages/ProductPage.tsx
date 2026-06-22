import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import ScaleOutlinedIcon from '@mui/icons-material/ScaleOutlined';
import { PageLoader } from '@/components/ui/PageLoader';
import { CART_QUANTITY, normalizeQuantity } from '@/api/validation';
import { useCart } from '@/context/CartContext';
import { useProduct } from '@/hooks/productsQuery';
import { formatProductCategory } from '@/types/productCategories';
import { formatPrice, formatWeight } from '@/utils/format';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { data: product, isLoading, isError } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        Не удалось загрузить товар
      </Alert>
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
              <Chip label={formatProductCategory(product.category)} sx={{ alignSelf: 'flex-start' }} />
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
                    <Typography variant="body2">
                      Страна: {product.manufacturerCountry}
                    </Typography>
                  </Stack>
                )}
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <ScaleOutlinedIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Вес: {formatWeight(product.weight)}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                <TextField
                  label="Количество"
                  type="number"
                  size="small"
                  value={quantity}
                  onChange={(event) => setQuantity(normalizeQuantity(Number(event.target.value)))}
                  inputProps={{ min: CART_QUANTITY.min, max: CART_QUANTITY.max }}
                  sx={{ width: 140 }}
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
