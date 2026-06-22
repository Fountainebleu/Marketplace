import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { cardHoverSx } from '@/theme';
import { formatPrice, formatWeight } from '@/utils/format';
import { formatProductCategory } from '@/types/productCategories';
import { IProduct } from '@/types/product';

interface IProductCardProps {
  product: IProduct;
}

export const ProductCard = ({ product }: IProductCardProps) => (
  <Card sx={{ height: '100%', ...cardHoverSx }}>
    <CardActionArea
      component={RouterLink}
      to={`/products/${product.id}`}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
    >
      <Box sx={{ position: 'relative', pt: '75%', bgcolor: 'grey.100', overflow: 'hidden' }}>
        <Box
          component="img"
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '.MuiCardActionArea-root:hover &': { transform: 'scale(1.05)' },
          }}
        />
      </Box>

      <CardContent sx={{ flex: 1, p: 2.5 }}>
        <Stack spacing={1.5}>
          <Chip label={formatProductCategory(product.category)} size="small" />
          <Typography variant="subtitle1" fontWeight={600} sx={{ lineHeight: 1.3 }}>
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 40,
            }}
          >
            {product.description}
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography variant="h6" color="primary.main" fontWeight={700}>
              {formatPrice(product.price)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatWeight(product.weight)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </CardActionArea>
  </Card>
);
