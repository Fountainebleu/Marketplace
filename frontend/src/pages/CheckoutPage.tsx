import { FormEvent, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ApiError } from '@/api/client';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/orderService';
import { formatPrice } from '@/theme';
import { CheckoutForm } from '@/types/order';

const emptyForm: CheckoutForm = {
  customerName: '',
  phone: '',
  deliveryAddress: '',
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<CheckoutForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (items.length === 0 && !orderId) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Нечего оформлять
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" size="large" sx={{ mt: 2 }}>
          В каталог
        </Button>
      </Box>
    );
  }

  const validate = (): boolean => {
    const next: Partial<CheckoutForm> = {};
    if (!form.customerName.trim()) next.customerName = 'Укажите имя';
    if (!form.phone.trim()) next.phone = 'Укажите телефон';
    if (!form.deliveryAddress.trim()) next.deliveryAddress = 'Укажите адрес доставки';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const order = await createOrder({
        customerId: crypto.randomUUID(),
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        deliveryAddress: form.deliveryAddress.trim(),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      setOrderId(order.id);
      clearCart();
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : 'Не удалось оформить заказ. Попробуйте позже.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <Box maxWidth={520} mx="auto" textAlign="center" py={6}>
        <Paper sx={{ p: 5 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Заказ оформлен!
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Номер заказа: {orderId}
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/')}>
            Вернуться в каталог
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Оформление заказа
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Заполните данные для доставки
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {submitError}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="flex-start">
        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <LocalShippingOutlinedIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Адрес доставки
            </Typography>
          </Stack>
          <Stack spacing={2.5}>
            <TextField
              label="Имя получателя"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              error={!!errors.customerName}
              helperText={errors.customerName}
              fullWidth
              required
              disabled={submitting}
            />
            <TextField
              label="Телефон"
              placeholder="+7 (999) 000-00-00"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              error={!!errors.phone}
              helperText={errors.phone}
              fullWidth
              required
              disabled={submitting}
            />
            <TextField
              label="Адрес доставки"
              placeholder="Город, улица, дом, квартира"
              value={form.deliveryAddress}
              onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
              error={!!errors.deliveryAddress}
              helperText={errors.deliveryAddress}
              fullWidth
              multiline
              minRows={3}
              required
              disabled={submitting}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 1 }}
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Подтвердить заказ'}
            </Button>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, width: { xs: '100%', lg: 380 }, position: { lg: 'sticky' }, top: 96 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Ваш заказ
          </Typography>
          <Stack spacing={2} divider={<Divider flexItem />}>
            {items.map((item) => (
              <Stack key={item.productId} direction="row" justifyContent="space-between" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  {item.productName} × {item.quantity}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatPrice(item.unitPrice * item.quantity)}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Divider sx={{ my: 2.5 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography fontWeight={600}>Итого</Typography>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              {formatPrice(totalPrice)}
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
