import { FC, useCallback } from 'react';
import {
  Box,
  Chip,
  FormControl,
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import AsyncContent from '@/components/UI/async-content/AsyncContent';
import { useOrdersList } from '@/hooks/ordersQuery';
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_FILTER_OPTIONS,
  formatOrderStatus,
} from '@/types/orderStatus';
import { formatDate, formatPrice, shortId } from '@/utils/format';
import { getSearchParam, setSearchParam } from '@/utils/searchParams';
import { OrderStatus } from '@/types/order';

const AdminOrdersPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = getSearchParam(searchParams, 'status');

  const setStatusFilter = useCallback((status: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      setSearchParam(params, 'status', status);
      return params;
    }, { replace: true });
  }, [setSearchParams]);

  const { data: orders = [], isLoading, isError, refetch } = useOrdersList({
    page: 1,
    pageSize: 50,
    status: statusFilter || undefined,
  });

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2} mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Заказы
          </Typography>
          <Typography color="text.secondary">
            Просмотр и управление статусами заказов
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            label="Статус"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {ORDER_STATUS_FILTER_OPTIONS.map((option) => (
              <MenuItem key={option.value || 'all'} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

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
                <TableCell>Клиент</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell align="right">Сумма</TableCell>
                <TableCell>Дата</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    Заказов нет
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{shortId(order.id)}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.phone}</TableCell>
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

export default AdminOrdersPage;
