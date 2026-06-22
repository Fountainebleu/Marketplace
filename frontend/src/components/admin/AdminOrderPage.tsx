import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import Loader from '@/components/UI/loader/Loader';
import { validateOrderStatusComment } from '@/api/validation';
import { useOrder, useUpdateOrderStatus } from '@/hooks/ordersQuery';
import {
  ORDER_NEXT_STATUSES,
  ORDER_STATUS_COLORS,
  formatOrderStatus,
} from '@/types/orderStatus';
import { formatDate, formatPrice } from '@/utils/format';
import { OrderStatus } from '@/types/order';

const AdminOrderPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useOrder(id);
  const updateStatusMutation = useUpdateOrderStatus();

  const [nextStatus, setNextStatus] = useState<OrderStatus | ''>('');
  const [comment, setComment] = useState('');
  const [statusError, setStatusError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  if (isLoading) {
    return <Loader text="Пожалуйста, подождите..." />;
  }

  if (isError || !order) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        Заказ не найден
      </Alert>
    );
  }

  const allowedStatuses = ORDER_NEXT_STATUSES[order.status as OrderStatus] ?? [];
  const history = order.history ?? [];

  const handleStatusUpdate = () => {
    if (!id || nextStatus === '') {
      setStatusError('Выберите новый статус');
      return;
    }

    const nextCommentError = validateOrderStatusComment(comment);
    setCommentError(nextCommentError ?? null);

    if (nextCommentError) {
      return;
    }

    setStatusError(null);
    updateStatusMutation.mutate(
      {
        id,
        request: {
          status: nextStatus,
          comment: comment.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setNextStatus('');
          setComment('');
        },
        onError: () => setStatusError('Не удалось сменить статус. Проверьте допустимый переход.'),
      },
    );
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/admin/orders" underline="hover" color="text.secondary">
          Заказы
        </Link>
        <Typography color="text.primary">{order.id}</Typography>
      </Breadcrumbs>

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin/orders')}
        sx={{ mb: 3 }}
      >
        К списку
      </Button>

      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2} mb={2}>
            <Typography variant="h5" fontWeight={700}>
              Заказ {order.id.slice(0, 8)}…
            </Typography>
            <Chip
              label={formatOrderStatus(order.status as OrderStatus)}
              color={ORDER_STATUS_COLORS[order.status as OrderStatus]}
            />
          </Stack>

          <Stack spacing={1} color="text.secondary">
            <Typography><strong>Клиент:</strong> {order.customerName}</Typography>
            <Typography><strong>Телефон:</strong> {order.phone}</Typography>
            <Typography><strong>Адрес:</strong> {order.deliveryAddress}</Typography>
            <Typography><strong>Создан:</strong> {formatDate(order.createdAt, 'medium')}</Typography>
            <Typography variant="h6" color="primary.main" fontWeight={700} sx={{ pt: 1 }}>
              Итого: {formatPrice(order.totalPrice)}
            </Typography>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Состав заказа
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Товар</TableCell>
                <TableCell align="right">Цена</TableCell>
                <TableCell align="right">Кол-во</TableCell>
                <TableCell align="right">Сумма</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(order.items ?? []).map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell align="right">{formatPrice(item.unitPrice)}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{formatPrice(item.unitPrice * item.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            История статусов
          </Typography>
          {history.length === 0 ? (
            <Typography color="text.secondary">История пуста</Typography>
          ) : (
            <Stack spacing={1.5} divider={<Divider flexItem />}>
              {history.map((entry, index) => (
                <Box key={`${entry.changedAt}-${index}`}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                    <Chip
                      label={formatOrderStatus(entry.status as OrderStatus)}
                      size="small"
                      color={ORDER_STATUS_COLORS[entry.status as OrderStatus]}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(entry.changedAt, 'medium')}
                    </Typography>
                  </Stack>
                  {entry.comment && (
                    <Typography variant="body2" color="text.secondary">
                      {entry.comment}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Paper>

        {allowedStatuses.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Сменить статус
            </Typography>
            {statusError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {statusError}
              </Alert>
            )}
            <Stack spacing={2} maxWidth={480}>
              <FormControl fullWidth>
                <InputLabel>Новый статус</InputLabel>
                <Select
                  label="Новый статус"
                  value={nextStatus}
                  onChange={(event) => setNextStatus(event.target.value as OrderStatus)}
                >
                  {allowedStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {formatOrderStatus(status)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Комментарий"
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value);
                  setCommentError(null);
                }}
                error={!!commentError}
                helperText={commentError}
                multiline
                minRows={2}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleStatusUpdate}
                disabled={nextStatus === '' || updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? 'Сохранение…' : 'Обновить статус'}
              </Button>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Box>
  );
};

export default AdminOrderPage;
