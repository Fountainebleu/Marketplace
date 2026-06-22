import { useState } from 'react';
import {
  Alert,
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
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '@/components/ui/PageLoader';
import { useOrdersList } from '@/hooks/ordersQuery';
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_FILTER_OPTIONS,
  formatOrderStatus,
} from '@/types/orderStatus';
import { formatDate, formatPrice, shortId } from '@/utils/format';
import { OrderStatus } from '@/types/order';

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const { data: orders = [], isLoading, isError } = useOrdersList({
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

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Не удалось загрузить заказы
        </Alert>
      )}

      <TableContainer component={Paper}>
        {isLoading ? (
          <PageLoader />
        ) : (
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
        )}
      </TableContainer>
    </Box>
  );
}
