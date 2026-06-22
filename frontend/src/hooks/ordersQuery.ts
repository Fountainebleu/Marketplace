import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/api/ordersApi';
import { CreateOrderRequest, UpdateOrderStatusRequest } from '@/types/order';

export const ORDERS_QUERY_KEY = ['orders'];

export function useCreateOrder() {
  return useMutation({
    mutationFn: (request: CreateOrderRequest) => ordersApi.create(request),
  });
}

export function useOrdersList(params: { page: number; pageSize: number; status?: string }) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, 'list', params],
    queryFn: () => ordersApi.getList(params),
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, 'detail', id ?? ''],
    queryFn: () => ordersApi.getById(id!),
    enabled: Boolean(id),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateOrderStatusRequest }) =>
      ordersApi.updateStatus(id, request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ORDERS_QUERY_KEY, 'detail', variables.id] });
    },
  });
}
