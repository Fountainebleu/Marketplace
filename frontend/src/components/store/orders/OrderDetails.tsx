import { FC } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/UI/loader/Loader';
import { useOrder } from '@/hooks/ordersQuery';
import { ORDER_STATUS_COLORS, formatOrderStatus } from '@/types/orderStatus';
import { formatDate, formatPrice } from '@/utils/format';
import { OrderStatus } from '@/types/order';

interface IOrderDetailsProps {
  id: string;
}

const OrderDetails: FC<IOrderDetailsProps> = ({ id }) => {
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useOrder(id);

  if (isLoading) {
    return <Loader text="Пожалуйста, подождите..." />;
  }

  if (isError || !order) {
    return (
      <Box>
        <Alert severity="error" sx={{ borderRadius: 3, mb: 3 }}>
          Заказ не найден
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/my-order')}>
          К списку заказов
        </Button>
      </Box>
    );
  }

  const history = order.history ?? [];

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/my-order')}
        sx={{ mb: 3 }}
      >
        К списку заказов
      </Button>

      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2} mb={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LocalShippingOutlinedIcon color="primary" />
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Заказ {order.id.slice(0, 8)}…
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  от {formatDate(order.createdAt, 'medium')}
                </Typography>
              </Box>
            </Stack>
            <Chip
              label={formatOrderStatus(order.status as OrderStatus)}
              color={ORDER_STATUS_COLORS[order.status as OrderStatus]}
              sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
            />
          </Stack>

          <Stack spacing={1} color="text.secondary">
            <Typography><strong>Получатель:</strong> {order.customerName}</Typography>
            <Typography><strong>Телефон:</strong> {order.phone}</Typography>
            <Typography><strong>Адрес:</strong> {order.deliveryAddress}</Typography>
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
            <Typography color="text.secondary">История пока пуста</Typography>
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
      </Stack>
    </Box>
  );
};

export default OrderDetails;
