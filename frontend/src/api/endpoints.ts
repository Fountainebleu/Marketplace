const Endpoints = {
  PRODUCTS: import.meta.env.VITE_PRODUCTS_API_URL ?? '/api/products',
  ORDERS: import.meta.env.VITE_ORDERS_API_URL ?? '/api/orders',
};

export default Endpoints;
