import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import StoreLayout from '@/components/layouts/StoreLayout';

const CatalogPage = lazy(() => import('@/components/store/CatalogPage'));
const ProductPage = lazy(() => import('@/components/store/ProductPage'));
const CartPage = lazy(() => import('@/components/store/CartPage'));
const CheckoutPage = lazy(() => import('@/components/store/CheckoutPage'));
const MyOrderPage = lazy(() => import('@/components/store/MyOrderPage'));
const AdminProductsPage = lazy(() => import('@/components/admin/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('@/components/admin/AdminOrdersPage'));
const AdminOrderPage = lazy(() => import('@/components/admin/AdminOrderPage'));

export const router = createBrowserRouter([
  {
    element: <StoreLayout />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'products/:id', element: <ProductPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'my-order', element: <MyOrderPage /> },
      { path: 'my-order/:id', element: <MyOrderPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="products" replace /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'orders/:id', element: <AdminOrderPage /> },
    ],
  },
]);
