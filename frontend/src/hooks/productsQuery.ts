import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  deleteProduct,
  getProductById,
  searchProducts,
  updateProduct,
} from '@/api/index';
import { IProductRequest, IProductSearchParams } from '@/types/product';

const PRODUCTS_QUERY_KEY = ['products'];

function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
}

export function useProductsSearch(params: IProductSearchParams) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'list', params],
    queryFn: () => searchProducts(params),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'detail', id ?? ''],
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: (request: IProductRequest) => createProduct(request),
    onSuccess: invalidate,
  });
}

export function useUpdateProduct() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: IProductRequest }) =>
      updateProduct(id, request),
    onSuccess: invalidate,
  });
}

export function useDeleteProduct() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: invalidate,
  });
}
