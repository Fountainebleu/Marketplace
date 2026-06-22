import { FC, FormEvent, useState } from 'react';
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
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '@/api/instance';
import { hasValidationErrors, validateCheckoutForm } from '@/api/validation';
import { useCart } from '@/contexts/CartContext';
import { useCreateOrder, useUpdateOrderStatus } from '@/hooks/ordersQuery';
import { formatPrice } from '@/utils/format';
import { ICheckoutForm, IOrderResponse, OrderStatus } from '@/types/order';

const emptyForm: ICheckoutForm = {
  customerName: '',
  phone: '',
  deliveryAddress: '',
};

type CheckoutErrors = Partial<Record<keyof ICheckoutForm | 'items', string>>;

const CheckoutPage: FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<ICheckoutForm>(emptyForm);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [createdOrder, setCreatedOrder] = useState<IOrderResponse | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const createOrderMutation = useCreateOrder();
  const payOrderMutation = useUpdateOrderStatus();

  if (items.length === 0 && !createdOrder) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Корзина пуста
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" size="large" sx={{ mt: 2 }}>
          В каталог
        </Button>
      </Box>
    );
  }

  const updateField = <K extends keyof ICheckoutForm>(key: K, value: ICheckoutForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const nextErrors = validateCheckoutForm(form, items.length);
    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    createOrderMutation.mutate(
      {
        customerId: crypto.randomUUID(),
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        deliveryAddress: form.deliveryAddress.trim(),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: (order) => {
          setCreatedOrder(order);
          clearCart();
        },
      },
    );
  };

  const handlePay = () => {
    if (!createdOrder) {
      return;
    }

    payOrderMutation.mutate(
      {
        id: createdOrder.id,
        request: { status: OrderStatus.Paid },
      },
      {
        onSuccess: () => {
          setIsPaid(true);
        },
      },
    );
  };

  const submitError = createOrderMutation.error
    ? getApiErrorMessage(createOrderMutation.error, 'Не удалось оформить заказ. Попробуйте позже.')
    : null;

  const payError = payOrderMutation.error
    ? getApiErrorMessage(payOrderMutation.error, 'Не удалось провести оплату. Попробуйте ещё раз.')
    : null;

  if (isPaid && createdOrder) {
    return (
      <Box maxWidth={520} mx="auto" textAlign="center" py={6}>
        <Paper sx={{ p: 5 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Оплата прошла успешно!
          </Typography>
          <Typography color="text.secondary" mb={1}>
            Заказ оформлен и оплачен
          </Typography>
          <Typography color="text.secondary" mb={1}>
            Номер заказа: {createdOrder.id.slice(0, 8)}…
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Сумма: {formatPrice(createdOrder.totalPrice)}
          </Typography>
          <Stack spacing={1.5}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate('/my-order')}
            >
              Мои заказы
            </Button>
            <Button variant="outlined" size="large" fullWidth onClick={() => navigate('/')}>
              Продолжить покупки
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  if (createdOrder) {
    return (
      <Box maxWidth={520} mx="auto" py={6}>
        <Paper sx={{ p: 5 }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <CreditCardOutlinedIcon sx={{ fontSize: 64, color: 'primary.main' }} />
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Оплата заказа
              </Typography>
              <Typography color="text.secondary">
                Номер заказа: {createdOrder.id.slice(0, 8)}…
              </Typography>
            </Box>

            <Box width="100%">
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography color="text.secondary">К оплате</Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {formatPrice(createdOrder.totalPrice)}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Доставка: {createdOrder.deliveryAddress}
              </Typography>
            </Box>

            {payError && (
              <Alert severity="error" sx={{ width: '100%', borderRadius: 3 }}>
                {payError}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<CreditCardOutlinedIcon />}
              onClick={handlePay}
              disabled={payOrderMutation.isPending}
            >
              {payOrderMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Оплатить'
              )}
            </Button>
          </Stack>
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
        Укажите контакты и адрес доставки
      </Typography>

      {errors.items && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
          {errors.items}
        </Alert>
      )}

      {submitError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {submitError}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="flex-start">
        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, flex: 1 }} noValidate>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <LocalShippingOutlinedIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Данные для доставки
            </Typography>
          </Stack>
          <Stack spacing={2.5}>
            <TextField
              label="Имя получателя"
              value={form.customerName}
              onChange={(event) => updateField('customerName', event.target.value)}
              error={!!errors.customerName}
              helperText={errors.customerName}
              fullWidth
              required
              disabled={createOrderMutation.isPending}
            />
            <TextField
              label="Телефон"
              placeholder="+7 (999) 000-00-00"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              fullWidth
              required
              disabled={createOrderMutation.isPending}
            />
            <TextField
              label="Адрес доставки"
              placeholder="Город, улица, дом, квартира"
              value={form.deliveryAddress}
              onChange={(event) => updateField('deliveryAddress', event.target.value)}
              error={!!errors.deliveryAddress}
              helperText={errors.deliveryAddress}
              fullWidth
              multiline
              minRows={3}
              required
              disabled={createOrderMutation.isPending}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 1 }}
              disabled={createOrderMutation.isPending || items.length === 0}
            >
              {createOrderMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Подтвердить заказ'
              )}
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
};

export default CheckoutPage;
