import { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { hasValidationErrors, validateProductRequest } from '@/api/validation';
import { FILTER_CATEGORIES, formatProductCategory } from '@/types/productCategories';
import { Product, ProductCategory, ProductRequest } from '@/types/product';

export const emptyProductForm: ProductRequest = {
  sku: '',
  name: '',
  description: '',
  price: 0,
  category: ProductCategory.General,
  manufacturerCountry: 'Россия',
  weight: 1,
  width: 1,
  height: 1,
  length: 1,
  imageUrl: 'https://placehold.co/600x400/png',
};

export function productToForm(product: Product): ProductRequest {
  return {
    sku: product.sku,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    manufacturerCountry: product.manufacturerCountry ?? '',
    weight: product.weight,
    width: product.width,
    height: product.height,
    length: product.length,
    imageUrl: product.imageUrl ?? '',
  };
}

interface ProductFormDialogProps {
  open: boolean;
  product: Product | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (payload: ProductRequest) => void;
}

export function ProductFormDialog({
  open,
  product,
  isSaving,
  onClose,
  onSubmit,
}: ProductFormDialogProps) {
  const [form, setForm] = useState<ProductRequest>(emptyProductForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ProductRequest, string>>>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(product ? productToForm(product) : emptyProductForm);
    setFieldErrors({});
  }, [open, product]);

  const setField = <K extends keyof ProductRequest>(key: K, value: ProductRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = () => {
    const payload: ProductRequest = {
      ...form,
      sku: form.sku.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      manufacturerCountry: form.manufacturerCountry?.trim() || undefined,
      imageUrl: form.imageUrl?.trim() || undefined,
    };

    const nextErrors = validateProductRequest(payload);
    setFieldErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={isSaving ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>{product ? 'Редактировать товар' : 'Новый товар'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Артикул (SKU)"
              value={form.sku}
              onChange={(event) => setField('sku', event.target.value)}
              error={!!fieldErrors.sku}
              helperText={fieldErrors.sku}
              fullWidth
              required
            />
            <TextField
              label="Название"
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
              fullWidth
              required
            />
          </Stack>
          <TextField
            label="Описание"
            value={form.description}
            onChange={(event) => setField('description', event.target.value)}
            error={!!fieldErrors.description}
            helperText={fieldErrors.description}
            fullWidth
            multiline
            minRows={3}
            required
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Цена"
              type="number"
              value={form.price}
              onChange={(event) => setField('price', Number(event.target.value))}
              error={!!fieldErrors.price}
              helperText={fieldErrors.price}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            <FormControl fullWidth error={!!fieldErrors.category}>
              <InputLabel>Категория</InputLabel>
              <Select
                label="Категория"
                value={form.category}
                onChange={(event) => setField('category', event.target.value as ProductCategory)}
              >
                {FILTER_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {formatProductCategory(category)}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.category && <FormHelperText>{fieldErrors.category}</FormHelperText>}
            </FormControl>
          </Stack>
          <TextField
            label="Страна производителя"
            value={form.manufacturerCountry ?? ''}
            onChange={(event) => setField('manufacturerCountry', event.target.value)}
            error={!!fieldErrors.manufacturerCountry}
            helperText={fieldErrors.manufacturerCountry}
            fullWidth
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {(['weight', 'width', 'height', 'length'] as const).map((field) => (
              <TextField
                key={field}
                label={
                  field === 'weight'
                    ? 'Вес, кг'
                    : field === 'width'
                      ? 'Ширина, см'
                      : field === 'height'
                        ? 'Высота, см'
                        : 'Длина, см'
                }
                type="number"
                value={form[field]}
                onChange={(event) => setField(field, Number(event.target.value))}
                error={!!fieldErrors[field]}
                helperText={fieldErrors[field]}
                inputProps={{ min: 0.01, step: 0.01 }}
                fullWidth
              />
            ))}
          </Stack>
          <TextField
            label="URL изображения"
            value={form.imageUrl ?? ''}
            onChange={(event) => setField('imageUrl', event.target.value)}
            error={!!fieldErrors.imageUrl}
            helperText={fieldErrors.imageUrl}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSaving}>
          Отмена
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? <CircularProgress size={22} color="inherit" /> : 'Сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
