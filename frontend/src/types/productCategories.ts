import { ProductCategory } from '@/types/product';

const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.Undefined]: '—',
  [ProductCategory.General]: 'Разное',
  [ProductCategory.Electronics]: 'Электроника',
  [ProductCategory.Food]: 'Продукты',
  [ProductCategory.Household]: 'Для дома',
  [ProductCategory.Clothes]: 'Одежда',
  [ProductCategory.Books]: 'Книги',
};

export const FILTER_CATEGORIES = [
  ProductCategory.General,
  ProductCategory.Electronics,
  ProductCategory.Food,
  ProductCategory.Household,
  ProductCategory.Clothes,
  ProductCategory.Books,
];

export function formatProductCategory(category: ProductCategory): string {
  return PRODUCT_CATEGORY_LABELS[category] ?? String(category);
}
