/** ProductService.Domain.Enums.ProductCategory */
export enum ProductCategory {
  Undefined = 0,
  General = 1,
  Electronics = 2,
  Food = 3,
  Household = 4,
  Clothes = 5,
  Books = 6,
}

/** ProductService.Presentation.Models.ProductResponse */
export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  manufacturerCountry?: string;
  weight: number;
  width: number;
  height: number;
  length: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** ProductService.Presentation.Models.ProductSearchRequest */
export interface ProductSearchParams {
  query?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sortBy?: number;
  sortDirection?: number;
}

/** ProductService.Presentation.Models.ProductListResponse */
export interface ProductListResult {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/** ProductService.Presentation.Models.ProductRequest */
export interface ProductRequest {
  sku: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  manufacturerCountry?: string;
  weight: number;
  width: number;
  height: number;
  length: number;
  imageUrl?: string;
}
