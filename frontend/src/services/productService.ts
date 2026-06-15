import { apiGet, ApiError } from '@/api/client';
import { config } from '@/config';
import { Product, ProductListResult, ProductSearchParams } from '@/types/product';

interface ProductListResponseDto {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export async function searchProducts(params: ProductSearchParams): Promise<ProductListResult> {
  const response = await apiGet<ProductListResponseDto>(config.productsApiUrl, {
    Query: params.query,
    Category: params.category,
    MinPrice: params.minPrice,
    MaxPrice: params.maxPrice,
    Page: params.page ?? 1,
    PageSize: params.pageSize ?? 12,
  });

  return {
    items: response.items,
    totalCount: response.totalCount,
    page: response.page,
    pageSize: response.pageSize,
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    return await apiGet<Product>(`${config.productsApiUrl}/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
