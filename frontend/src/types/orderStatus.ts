import { OrderStatus } from '@/types/order';

export const ORDER_NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.Created]: [OrderStatus.Paid, OrderStatus.Canceled],
  [OrderStatus.Paid]: [OrderStatus.Assembling, OrderStatus.Canceled],
  [OrderStatus.Assembling]: [OrderStatus.HandedToDelivery, OrderStatus.Canceled],
  [OrderStatus.HandedToDelivery]: [OrderStatus.Delivered, OrderStatus.Canceled],
  [OrderStatus.Delivered]: [],
  [OrderStatus.Canceled]: [],
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Created]: 'Создан',
  [OrderStatus.Paid]: 'Оплачен',
  [OrderStatus.Assembling]: 'Сборка',
  [OrderStatus.HandedToDelivery]: 'Передан в доставку',
  [OrderStatus.Delivered]: 'Доставлен',
  [OrderStatus.Canceled]: 'Отменён',
};

export const ORDER_STATUS_COLORS: Record<
  OrderStatus,
  'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
> = {
  [OrderStatus.Created]: 'info',
  [OrderStatus.Paid]: 'primary',
  [OrderStatus.Assembling]: 'warning',
  [OrderStatus.HandedToDelivery]: 'secondary',
  [OrderStatus.Delivered]: 'success',
  [OrderStatus.Canceled]: 'error',
};

export const ORDER_STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Все' },
  ...(
    [
      OrderStatus.Created,
      OrderStatus.Paid,
      OrderStatus.Assembling,
      OrderStatus.HandedToDelivery,
      OrderStatus.Delivered,
      OrderStatus.Canceled,
    ] as const
  ).map((status) => ({
    value: OrderStatus[status],
    label: ORDER_STATUS_LABELS[status],
  })),
];

export function formatOrderStatus(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? String(status);
}
