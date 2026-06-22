/** Orders.Api.Domain.OrderStatus */
export enum OrderStatus {
  Created = 0,
  Paid = 1,
  Assembling = 2,
  HandedToDelivery = 3,
  Delivered = 4,
  Canceled = 5,
}

export interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
}

export interface CheckoutForm {
  customerName: string;
  phone: string;
  deliveryAddress: string;
}

/** Orders.Api.Contracts.CreateOrderItemRequest */
export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
}

/** Orders.Api.Contracts.CreateOrderRequest */
export interface CreateOrderRequest {
  customerId: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  items: CreateOrderItemRequest[];
}

/** Orders.Api.Contracts.OrderItemResponse */
export interface OrderItemResponse {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

/** Orders.Api.Contracts.OrderStatusHistoryResponse */
export interface OrderStatusHistoryResponse {
  status: OrderStatus;
  comment?: string;
  changedAt: string;
}

/** Orders.Api.Contracts.OrderResponse */
export interface OrderResponse {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
  history: OrderStatusHistoryResponse[];
}

/** Orders.Api.Contracts.UpdateOrderStatusRequest */
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  comment?: string;
}
