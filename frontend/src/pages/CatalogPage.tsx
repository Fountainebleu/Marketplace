import { useState } from 'react';
import { Alert, Box, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { CatalogFilters, CatalogFiltersState } from '@/components/catalog/CatalogFilters';
import { ProductCard } from '@/components/catalog/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListPagination } from '@/components/ui/ListPagination';
import { PageLoader } from '@/components/ui/PageLoader';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { getPageInfo, useServerPagination } from '@/hooks/useServerPagination';
import { useProductsSearch } from '@/hooks/productsQuery';
import { hasValidationErrors, validateCatalogPriceFilters } from '@/api/validation';
import { pluralizeProducts } from '@/utils/format';
import { Product, ProductCategory } from '@/types/product';

const PAGE_SIZE = 12;

const defaultFilters: CatalogFiltersState = {
  query: '',
  category: '',
  minPrice: '',
  maxPrice: '',
};

export default function CatalogPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const debouncedQuery = useDebouncedValue(filters.query);
  const { page, goToPage } = useServerPagination([
    debouncedQuery,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
  ]);

  const priceErrors = validateCatalogPriceFilters(filters.minPrice, filters.maxPrice);
  const hasPriceErrors = hasValidationErrors(priceErrors);

  const { data, isLoading, isError } = useProductsSearch({
    query: debouncedQuery || undefined,
    category: filters.category !== '' ? (filters.category as ProductCategory) : undefined,
    minPrice: !hasPriceErrors && filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: !hasPriceErrors && filters.maxPrice ? Number(filters.maxPrice) : undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const { items, totalCount, pageSize, pageCount } = getPageInfo(data, PAGE_SIZE);
  const products = items as Product[];

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
        <Typography sx={{ opacity: 0.92, maxWidth: '100%' }}>
          Электроника, продукты, одежда, книги и многое другое — с доставкой на дом.
        </Typography>
      </Box>

      <CatalogFilters filters={filters} onChange={setFilters} priceErrors={priceErrors} />

      {!isLoading && !isError && (
        <Typography variant="body2" color="text.secondary" sx={{ my: 2.5 }}>
          Найдено: {totalCount} {pluralizeProducts(totalCount)}
        </Typography>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
          Не удалось загрузить каталог
        </Alert>
      )}

      {isLoading ? (
        <PageLoader />
      ) : products.length === 0 ? (
        <EmptyState
          title="Товары не найдены"
          description="Попробуйте другую категорию или измените поиск"
        />
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {totalCount > pageSize && (
            <Stack sx={{ mt: 5 }}>
              <ListPagination page={page} pageCount={pageCount} onChange={goToPage} />
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
