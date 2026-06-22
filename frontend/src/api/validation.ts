import { CheckoutForm } from '@/types/order';
import { ProductCategory, ProductRequest } from '@/types/product';

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export const LIMITS = {
  customerName: 200,
  phone: 32,
  deliveryAddress: 500,
  orderComment: 1000,
  sku: 100,
  productName: 200,
  description: 2000,
  manufacturerCountry: 100,
  imageUrl: 2048,
} as const;

export const CART_QUANTITY = { min: 1, max: 999 } as const;

export function hasValidationErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}

export function normalizeQuantity(value: number): number {
  if (!Number.isFinite(value)) {
    return CART_QUANTITY.min;
  }

  return Math.min(CART_QUANTITY.max, Math.max(CART_QUANTITY.min, Math.floor(value)));
}

function checkRequired(value: string, emptyMessage: string, maxLength?: number): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return emptyMessage;
  }

  if (maxLength !== undefined && trimmed.length > maxLength) {
    return `Не более ${maxLength} символов`;
  }

  return undefined;
}

function checkPositive(value: number, message: string): string | undefined {
  if (!Number.isFinite(value) || value <= 0) {
    return message;
  }

  return undefined;
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function parsePrice(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function validateCheckoutForm(
  form: CheckoutForm,
  itemsCount: number,
): FieldErrors<keyof CheckoutForm> & { items?: string } {
  const errors: FieldErrors<keyof CheckoutForm> & { items?: string } = {};

  errors.customerName = checkRequired(form.customerName, 'Укажите имя получателя', LIMITS.customerName);

  const phone = form.phone.trim();
  if (!phone) {
    errors.phone = 'Укажите телефон';
  } else if (phone.length > LIMITS.phone) {
    errors.phone = `Не более ${LIMITS.phone} символов`;
  } else if (!isValidPhone(phone)) {
    errors.phone = 'Введите корректный номер (не менее 10 цифр)';
  }

  const address = form.deliveryAddress.trim();
  if (!address) {
    errors.deliveryAddress = 'Укажите адрес доставки';
  } else if (address.length < 10) {
    errors.deliveryAddress = 'Укажите полный адрес (улица, дом, квартира)';
  } else if (address.length > LIMITS.deliveryAddress) {
    errors.deliveryAddress = `Не более ${LIMITS.deliveryAddress} символов`;
  }

  if (itemsCount === 0) {
    errors.items = 'Добавьте товары в корзину';
  }

  return errors;
}

export function validateProductRequest(form: ProductRequest): FieldErrors<keyof ProductRequest> {
  const errors: FieldErrors<keyof ProductRequest> = {};

  errors.sku = checkRequired(form.sku, 'Укажите артикул', LIMITS.sku);
  errors.name = checkRequired(form.name, 'Укажите название', LIMITS.productName);
  errors.description = checkRequired(form.description, 'Укажите описание', LIMITS.description);
  errors.price = checkPositive(form.price, 'Цена должна быть больше 0');

  if (form.category === ProductCategory.Undefined) {
    errors.category = 'Выберите категорию';
  }

  const country = form.manufacturerCountry?.trim() ?? '';
  if (country.length > LIMITS.manufacturerCountry) {
    errors.manufacturerCountry = `Не более ${LIMITS.manufacturerCountry} символов`;
  }

  errors.weight = checkPositive(form.weight, 'Вес должен быть больше 0');
  errors.width = checkPositive(form.width, 'Ширина должна быть больше 0');
  errors.height = checkPositive(form.height, 'Высота должна быть больше 0');
  errors.length = checkPositive(form.length, 'Длина должна быть больше 0');

  const imageUrl = form.imageUrl?.trim() ?? '';
  if (imageUrl) {
    if (imageUrl.length > LIMITS.imageUrl) {
      errors.imageUrl = `Не более ${LIMITS.imageUrl} символов`;
    } else if (!isValidHttpUrl(imageUrl)) {
      errors.imageUrl = 'Укажите полный URL (http:// или https://)';
    }
  }

  return errors;
}

export function validateCatalogPriceFilters(
  minPrice: string,
  maxPrice: string,
): FieldErrors<'minPrice' | 'maxPrice'> {
  const errors: FieldErrors<'minPrice' | 'maxPrice'> = {};
  const min = parsePrice(minPrice);
  const max = parsePrice(maxPrice);

  if (minPrice.trim() !== '' && (min === null || min < 0)) {
    errors.minPrice = 'Укажите корректную цену от';
  }

  if (maxPrice.trim() !== '' && (max === null || max < 0)) {
    errors.maxPrice = 'Укажите корректную цену до';
  }

  if (min !== null && max !== null && min > max) {
    errors.minPrice = 'Цена «от» не может быть больше «до»';
    errors.maxPrice = 'Цена «до» не может быть меньше «от»';
  }

  return errors;
}

export function validateOrderStatusComment(comment: string): string | undefined {
  if (comment.length > LIMITS.orderComment) {
    return `Не более ${LIMITS.orderComment} символов`;
  }

  return undefined;
}
