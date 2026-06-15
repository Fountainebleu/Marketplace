import { apiPost } from '@/api/client';
import { config } from '@/config';
import { CreateOrderRequest, OrderResponse } from '@/types/order';

export async function createOrder(request: CreateOrderRequest): Promise<OrderResponse> {
  return apiPost<OrderResponse>(config.ordersApiUrl, request);
}
