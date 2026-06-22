export function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatWeight(weight: number) {
  return `${weight} кг`;
}

export function pluralizeProducts(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return 'товаров';
  }

  if (mod10 === 1) {
    return 'товар';
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return 'товара';
  }

  return 'товаров';
}

export function formatDate(value: string, dateStyle: 'short' | 'medium' = 'short') {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle,
    timeStyle: 'short',
  }).format(new Date(value));
}

export function shortId(id: string) {
  return id.slice(0, 8);
}
