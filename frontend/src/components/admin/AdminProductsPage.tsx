import { FC, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useSearchParams } from 'react-router-dom';
import { ProductFormDialog } from '@/components/admin/ProductFormDialog';
import ListPagination from '@/components/UI/paginator/ListPagination';
import AsyncContent from '@/components/UI/async-content/AsyncContent';
import {
  useCreateProduct,
  useDeleteProduct,
  useProductsSearch,
  useUpdateProduct,
} from '@/hooks/productsQuery';
import { FILTER_CATEGORIES, formatProductCategory } from '@/types/productCategories';
import { formatPrice } from '@/utils/format';
import { getPageInfo } from '@/utils/pagination';
import {
  getSearchParam,
  getSearchParamNumber,
  setSearchParam,
} from '@/utils/searchParams';
import {
  IProduct,
  IProductRequest,
  ProductCategory,
  ProductSortField,
  SortDirection,
} from '@/types/product';

const PAGE_SIZE = 10;

type SortableColumn = 'name' | 'price';

const columnToSortField: Record<SortableColumn, ProductSortField> = {
  name: ProductSortField.Name,
  price: ProductSortField.Price,
};

const AdminProductsPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IProduct | null>(null);

  const categoryFilter = getSearchParam(searchParams, 'category') as ProductCategory | '';
  const page = getSearchParamNumber(searchParams, 'page');
  const sortByParam = getSearchParam(searchParams, 'sortBy') as SortableColumn | '';
  const sortDirParam = getSearchParam(searchParams, 'sortDir');

  const sortBy = sortByParam && sortByParam in columnToSortField
    ? columnToSortField[sortByParam]
    : undefined;
  const sortDirection = sortDirParam === 'desc' ? SortDirection.Desc : SortDirection.Asc;

  const updateSearchParams = useCallback((
    patch: (params: URLSearchParams) => void,
    resetPage = false,
  ) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      patch(params);

      if (resetPage) {
        params.delete('page');
      }

      return params;
    }, { replace: true });
  }, [setSearchParams]);

  const setCategoryFilter = (category: ProductCategory | '') => {
    updateSearchParams((params) => {
      setSearchParam(params, 'category', category);
    }, true);
  };

  const setPage = (nextPage: number) => {
    updateSearchParams((params) => {
      setSearchParam(params, 'page', nextPage === 1 ? undefined : nextPage);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const requestSort = (column: SortableColumn) => {
    updateSearchParams((params) => {
      const currentColumn = params.get('sortBy');
      const currentDir = params.get('sortDir') ?? 'asc';

      if (currentColumn === column && currentDir === 'asc') {
        setSearchParam(params, 'sortBy', column);
        setSearchParam(params, 'sortDir', 'desc');
      } else {
        setSearchParam(params, 'sortBy', column);
        setSearchParam(params, 'sortDir', 'asc');
      }
    }, true);
  };

  const getSortDirection = (column: SortableColumn): 'asc' | 'desc' | false => {
    if (sortByParam !== column) {
      return false;
    }

    return sortDirParam === 'desc' ? 'desc' : 'asc';
  };

  const { data, isLoading, isError, refetch } = useProductsSearch({
    page,
    pageSize: PAGE_SIZE,
    category: categoryFilter !== '' ? categoryFilter : undefined,
    sortBy,
    sortDirection: sortBy ? sortDirection : undefined,
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const { items, totalCount, pageSize, pageCount } = getPageInfo(data, PAGE_SIZE);
  const products = items as IProduct[];
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const openCreate = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const openEdit = (product: IProduct) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleSubmit = (payload: IProductRequest) => {
    if (editingProduct) {
      updateMutation.mutate(
        { id: editingProduct.id, request: payload },
        { onSuccess: () => setDialogOpen(false) },
      );
      return;
    }

    createMutation.mutate(payload, { onSuccess: () => setDialogOpen(false) });
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2} mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Товары
          </Typography>
          <Typography color="text.secondary">
            Создание, редактирование и удаление товаров
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Категория</InputLabel>
            <Select
              label="Категория"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value as ProductCategory | '')}
            >
              <MenuItem value="">Все</MenuItem>
              {FILTER_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {formatProductCategory(category)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Добавить товар
          </Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <AsyncContent
          loading={isLoading}
          error={isError ? 'Не удалось загрузить товары' : null}
          onRetry={() => refetch()}
          minHeight={280}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Артикул</TableCell>
                <TableCell sortDirection={getSortDirection('name')}>
                  <TableSortLabel
                    active={sortByParam === 'name'}
                    direction={getSortDirection('name') || 'asc'}
                    onClick={() => requestSort('name')}
                  >
                    Название
                  </TableSortLabel>
                </TableCell>
                <TableCell>Категория</TableCell>
                <TableCell align="right" sortDirection={getSortDirection('price')}>
                  <TableSortLabel
                    active={sortByParam === 'price'}
                    direction={getSortDirection('price') || 'asc'}
                    onClick={() => requestSort('price')}
                  >
                    Цена
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    Товаров пока нет
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatProductCategory(product.category)}</TableCell>
                    <TableCell align="right">{formatPrice(product.price)}</TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="Редактировать" onClick={() => openEdit(product)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton aria-label="Удалить" color="error" onClick={() => setDeleteTarget(product)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </AsyncContent>
      </TableContainer>

      {!isLoading && totalCount > pageSize && (
        <ListPagination
          page={page}
          pageCount={pageCount}
          totalCount={totalCount}
          onChange={setPage}
        />
      )}

      <ProductFormDialog
        open={dialogOpen}
        product={editingProduct}
        isSaving={isSaving}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Удалить товар?</DialogTitle>
        <DialogContent>
          <Typography>
            «{deleteTarget?.name}» будет удалён без возможности восстановления.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Отмена</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProductsPage;
