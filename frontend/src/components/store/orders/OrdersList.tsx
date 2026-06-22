import { FC } from 'react';
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AsyncContent from '@/components/UI/async-content/AsyncContent';
import { useOrdersList } from '@/hooks/ordersQuery';
import { ORDER_STATUS_COLORS, formatOrderStatus } from '@/types/orderStatus';
import { formatDate, formatPrice, shortId } from '@/utils/format';
import { OrderStatus } from '@/types/order';

const OrdersList: FC = () => {
  const navigate = useNavigate();
  const { data: orders = [], isLoading, isError, refetch } = useOrdersList({
    page: 1,
    pageSize: 50,
  });

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Мои заказы
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Список всех заказов и их текущий статус
      </Typography>

      <TableContainer component={Paper}>
        <AsyncContent
          loading={isLoading}
          error={isError ? 'Не удалось загрузить заказы' : null}
          onRetry={() => refetch()}
          minHeight={280}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Получатель</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell align="right">Сумма</TableCell>
                <TableCell>Дата</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    Заказов пока нет
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    onClick={() => navigate(`/my-order/${order.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{shortId(order.id)}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      <Chip
                        label={formatOrderStatus(order.status as OrderStatus)}
                        color={ORDER_STATUS_COLORS[order.status as OrderStatus] ?? 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{formatPrice(order.totalPrice)}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </AsyncContent>
      </TableContainer>
    </Box>
  );
};

export default OrdersList;
