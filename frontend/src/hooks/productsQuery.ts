import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/productsApi';
import { ProductRequest, ProductSearchParams } from '@/types/product';

export const PRODUCTS_QUERY_KEY = ['products'];

function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
}

export function useProductsSearch(params: ProductSearchParams) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'list', params],
    queryFn: () => productsApi.search(params),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'detail', id ?? ''],
    queryFn: () => productsApi.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: (request: ProductRequest) => productsApi.create(request),
    onSuccess: invalidate,
  });
}

export function useUpdateProduct() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: ProductRequest }) =>
      productsApi.update(id, request),
    onSuccess: invalidate,
  });
}

export function useDeleteProduct() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: invalidate,
  });
}
