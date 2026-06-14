import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Grid2 as Grid,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { CatalogFilters, CatalogFiltersState } from '@/components/CatalogFilters';
import { ProductCard } from '@/components/ProductCard';
import { searchProducts } from '@/services/productService';
import { Product, ProductCategory } from '@/types/product';

const PAGE_SIZE = 9;
const defaultFilters: CatalogFiltersState = {
  query: '',
  category: '',
  minPrice: '',
  maxPrice: '',
};

export default function CatalogPage() {
  const [filters, setFilters] = useState<CatalogFiltersState>(defaultFilters);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(filters.query), 300);
    return () => clearTimeout(timer);
  }, [filters.query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, filters.category, filters.minPrice, filters.maxPrice]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchProducts({
        query: debouncedQuery || undefined,
        category: filters.category !== '' ? (filters.category as ProductCategory) : undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        page,
        pageSize: PAGE_SIZE,
      });
      setItems(result.items);
      setTotalCount(result.totalCount);
    } catch {
      setError('Не удалось загрузить каталог');
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, filters.category, filters.minPrice, filters.maxPrice, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
          color: '#fff',
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Каталог товаров
        </Typography>
        <Typography sx={{ opacity: 0.9, maxWidth: 480, mb: 2 }}>
          Выбирайте товары с быстрой доставкой — поиск, фильтры и оформление заказа в пару кликов.
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ opacity: 0.85 }}>
          <LocalShippingOutlinedIcon fontSize="small" />
          <Typography variant="body2">Бесплатная доставка от 3 000 ₽</Typography>
        </Stack>
      </Box>

      <CatalogFilters filters={filters} onChange={setFilters} />

      {!loading && !error && (
        <Typography variant="body2" color="text.secondary" sx={{ my: 2.5 }}>
          Найдено: {totalCount}
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
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
          <Typography variant="h6" gutterBottom>
            Товары не найдены
          </Typography>
          <Typography color="text.secondary">
            Попробуйте изменить фильтры или поисковый запрос
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {items.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
