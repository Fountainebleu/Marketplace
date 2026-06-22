import { apiGet, apiPatch, apiPost, ApiError, ORDERS_API_URL } from '@/api/api';
import { CreateOrderRequest, OrderResponse, UpdateOrderStatusRequest } from '@/types/order';

export const ordersApi = {
  create: (request: CreateOrderRequest) => apiPost<OrderResponse>(ORDERS_API_URL, request),

  getList: (params?: { page?: number; pageSize?: number; status?: string }) =>
    apiGet<OrderResponse[]>(ORDERS_API_URL, {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      status: params?.status,
    }),

  getById: async (id: string): Promise<OrderResponse | null> => {
    try {
      return await apiGet<OrderResponse>(`${ORDERS_API_URL}/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }

      throw error;
    }
  },

  updateStatus: (id: string, request: UpdateOrderStatusRequest) =>
    apiPatch<OrderResponse>(`${ORDERS_API_URL}/${id}/status`, request),
};
