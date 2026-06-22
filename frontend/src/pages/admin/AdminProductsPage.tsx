import { useEffect, useState } from 'react';
import {
  Alert,
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
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ProductFormDialog } from '@/components/admin/ProductFormDialog';
import { ListPagination } from '@/components/ui/ListPagination';
import { PageLoader } from '@/components/ui/PageLoader';
import { getPageInfo, useServerPagination } from '@/hooks/useServerPagination';
import {
  useCreateProduct,
  useDeleteProduct,
  useProductsSearch,
  useUpdateProduct,
} from '@/hooks/productsQuery';
import { FILTER_CATEGORIES, formatProductCategory } from '@/types/productCategories';
import { formatPrice } from '@/utils/format';
import { Product, ProductCategory, ProductRequest } from '@/types/product';

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | ''>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { page, goToPage, clampToMax } = useServerPagination([categoryFilter]);

  const { data, isLoading, isError } = useProductsSearch({
    page,
    pageSize: PAGE_SIZE,
    category: categoryFilter !== '' ? categoryFilter : undefined,
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const { items, totalCount, pageSize, pageCount } = getPageInfo(data, PAGE_SIZE);
  const products = items as Product[];
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    clampToMax(pageCount);
  }, [pageCount, clampToMax]);

  const openCreate = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleSubmit = (payload: ProductRequest) => {
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

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Не удалось загрузить товары
        </Alert>
      )}

      <TableContainer component={Paper}>
        {isLoading ? (
          <PageLoader />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Артикул</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell align="right">Цена</TableCell>
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
        )}
      </TableContainer>

      {!isLoading && totalCount > pageSize && (
        <ListPagination
          page={page}
          pageCount={pageCount}
          totalCount={totalCount}
          onChange={goToPage}
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
}
