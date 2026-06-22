import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createOrder,
  getOrderById,
  getOrdersList,
  updateOrderStatus,
} from '@/api/index';
import { ICreateOrderRequest, IUpdateOrderStatusRequest } from '@/types/order';

const ORDERS_QUERY_KEY = ['orders'];

export function useCreateOrder() {
  return useMutation({
    mutationFn: (request: ICreateOrderRequest) => createOrder(request),
  });
}

export function useOrdersList(params: { page: number; pageSize: number; status?: string }) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, 'list', params],
    queryFn: () => getOrdersList(params),
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, 'detail', id ?? ''],
    queryFn: () => getOrderById(id!),
    enabled: Boolean(id),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: IUpdateOrderStatusRequest }) =>
      updateOrderStatus(id, request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ORDERS_QUERY_KEY, 'detail', variables.id] });
    },
  });
}
