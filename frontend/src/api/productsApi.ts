import { apiDelete, apiGet, apiPost, apiPut, ApiError, PRODUCTS_API_URL } from '@/api/api';
import { Product, ProductListResult, ProductRequest, ProductSearchParams } from '@/types/product';

export const productsApi = {
  search: (params: ProductSearchParams) =>
    apiGet<ProductListResult>(PRODUCTS_API_URL, {
      query: params.query,
      category: params.category,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
    }),

  getById: async (id: string): Promise<Product | null> => {
    try {
      return await apiGet<Product>(`${PRODUCTS_API_URL}/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }

      throw error;
    }
  },

  create: (request: ProductRequest) => apiPost<Product>(PRODUCTS_API_URL, request),

  update: (id: string, request: ProductRequest) =>
    apiPut<Product>(`${PRODUCTS_API_URL}/${id}`, request),

  delete: (id: string) => apiDelete(`${PRODUCTS_API_URL}/${id}`),
};
