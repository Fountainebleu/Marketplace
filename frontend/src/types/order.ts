export enum OrderStatus {
  Created = 0,
  Paid = 1,
  Assembling = 2,
  HandedToDelivery = 3,
  Delivered = 4,
  Canceled = 5,
}

export interface ICartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
}

export interface ICheckoutForm {
  customerName: string;
  phone: string;
  deliveryAddress: string;
}

export interface ICreateOrderItemRequest {
  productId: string;
  quantity: number;
}

export interface ICreateOrderRequest {
  customerId: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  items: ICreateOrderItemRequest[];
}

export interface IOrderItemResponse {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface IOrderStatusHistoryResponse {
  status: OrderStatus;
  comment?: string;
  changedAt: string;
}

export interface IOrderResponse {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  items: IOrderItemResponse[];
  history: IOrderStatusHistoryResponse[];
}

export interface IUpdateOrderStatusRequest {
  status: OrderStatus;
  comment?: string;
}
