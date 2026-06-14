import { ProductCategory } from '@/types/product';

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.Undefined]: 'Без категории',
  [ProductCategory.General]: 'Общее',
  [ProductCategory.Electronics]: 'Электроника',
  [ProductCategory.Food]: 'Продукты',
  [ProductCategory.Household]: 'Бытовая химия',
  [ProductCategory.Clothes]: 'Одежда',
  [ProductCategory.Books]: 'Книги',
};

export const FILTER_CATEGORIES = [
  ProductCategory.Electronics,
  ProductCategory.Food,
  ProductCategory.Household,
  ProductCategory.Clothes,
  ProductCategory.Books,
  ProductCategory.General,
];
