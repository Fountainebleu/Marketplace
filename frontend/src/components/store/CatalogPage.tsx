import { FC, useCallback, useMemo } from 'react';
import { Box, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { CatalogFilters, ICatalogFiltersState } from '@/components/catalog/CatalogFilters';
import { ProductCard } from '@/components/catalog/ProductCard';
import EmptyState from '@/components/UI/empty-state/EmptyState';
import ListPagination from '@/components/UI/paginator/ListPagination';
import AsyncContent from '@/components/UI/async-content/AsyncContent';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useProductsSearch } from '@/hooks/productsQuery';
import { hasValidationErrors, validateCatalogPriceFilters } from '@/api/validation';
import { pluralizeProducts } from '@/utils/format';
import { getPageInfo } from '@/utils/pagination';
import {
  getSearchParam,
  getSearchParamNumber,
  setSearchParam,
} from '@/utils/searchParams';
import { IProduct, ProductCategory } from '@/types/product';

const PAGE_SIZE = 12;

const CatalogPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<ICatalogFiltersState>(() => ({
    query: getSearchParam(searchParams, 'q'),
    category: getSearchParam(searchParams, 'category') as ProductCategory | '',
    minPrice: getSearchParam(searchParams, 'minPrice'),
    maxPrice: getSearchParam(searchParams, 'maxPrice'),
  }), [searchParams]);

  const page = getSearchParamNumber(searchParams, 'page');
  const debouncedQuery = useDebouncedValue(filters.query);

  const setFilters = useCallback((next: ICatalogFiltersState) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      setSearchParam(params, 'q', next.query);
      setSearchParam(params, 'category', next.category);
      setSearchParam(params, 'minPrice', next.minPrice);
      setSearchParam(params, 'maxPrice', next.maxPrice);
      params.delete('page');

      return params;
    }, { replace: true });
  }, [setSearchParams]);

  const setPage = useCallback((nextPage: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      setSearchParam(params, 'page', nextPage === 1 ? undefined : nextPage);
      return params;
    }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setSearchParams]);

  const priceErrors = validateCatalogPriceFilters(filters.minPrice, filters.maxPrice);
  const hasPriceErrors = hasValidationErrors(priceErrors);

  const { data, isLoading, isError, refetch } = useProductsSearch({
    query: debouncedQuery || undefined,
    category: filters.category !== '' ? (filters.category as ProductCategory) : undefined,
    minPrice: !hasPriceErrors && filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: !hasPriceErrors && filters.maxPrice ? Number(filters.maxPrice) : undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const { items, totalCount, pageSize, pageCount } = getPageInfo(data, PAGE_SIZE);
  const products = items as IProduct[];

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

      <AsyncContent
        loading={isLoading}
        error={isError ? 'Не удалось загрузить каталог' : null}
        onRetry={() => refetch()}
        minHeight={320}
      >
        {products.length === 0 ? (
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
                <ListPagination page={page} pageCount={pageCount} onChange={setPage} />
              </Stack>
            )}
          </>
        )}
      </AsyncContent>
    </Box>
  );
};

export default CatalogPage;
