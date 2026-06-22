export enum ProductCategory {
  Undefined = 0,
  General = 1,
  Electronics = 2,
  Food = 3,
  Household = 4,
  Clothes = 5,
  Books = 6,
}

export enum ProductSortField {
  CreatedAt = 1,
  Name = 2,
  Price = 3,
}

export enum SortDirection {
  Asc = 1,
  Desc = 2,
}

export interface IProduct {
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

export interface IProductSearchParams {
  query?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sortBy?: ProductSortField;
  sortDirection?: SortDirection;
}

export interface IProductListResult {
  items: IProduct[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface IProductRequest {
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
