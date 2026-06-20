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

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  customerId: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  items: CreateOrderItemRequest[];
}

export interface OrderResponse {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
