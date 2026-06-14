export enum ProductCategory {
  Undefined = 0,
  General = 1,
  Electronics = 2,
  Food = 3,
  Household = 4,
  Clothes = 5,
  Books = 6,
}

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
}

export interface ProductSearchParams {
  query?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export interface ProductListResult {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
}
