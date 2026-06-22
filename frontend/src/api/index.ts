import Endpoints from './endpoints';
import { apiDelete, apiGet, apiPatch, apiPost, apiPut, ApiError } from './instance';
import {
  ICreateOrderRequest,
  IOrderResponse,
  IUpdateOrderStatusRequest,
} from '@/types/order';
import {
  IProduct,
  IProductListResult,
  IProductRequest,
  IProductSearchParams,
} from '@/types/product';

const { PRODUCTS, ORDERS } = Endpoints;

export const searchProducts = (params: IProductSearchParams) =>
  apiGet<IProductListResult>(PRODUCTS, {
    query: params.query,
    category: params.category,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection,
  });

export const getProductById = async (id: string): Promise<IProduct | null> => {
  try {
    return await apiGet<IProduct>(`${PRODUCTS}/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const createProduct = (request: IProductRequest) =>
  apiPost<IProduct>(PRODUCTS, request);

export const updateProduct = (id: string, request: IProductRequest) =>
  apiPut<IProduct>(`${PRODUCTS}/${id}`, request);

export const deleteProduct = (id: string) => apiDelete(`${PRODUCTS}/${id}`);

export const createOrder = (request: ICreateOrderRequest) =>
  apiPost<IOrderResponse>(ORDERS, request);

export const getOrdersList = (params?: { page?: number; pageSize?: number; status?: string }) =>
  apiGet<IOrderResponse[]>(ORDERS, {
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 20,
    status: params?.status,
  });

export const getOrderById = async (id: string): Promise<IOrderResponse | null> => {
  try {
    return await apiGet<IOrderResponse>(`${ORDERS}/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const updateOrderStatus = (id: string, request: IUpdateOrderStatusRequest) =>
  apiPatch<IOrderResponse>(`${ORDERS}/${id}/status`, request);
