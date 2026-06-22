import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { normalizeQuantity } from '@/api/validation';
import { CartItem } from '@/types/order';

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    const normalizedQuantity = normalizeQuantity(quantity);

    setItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.productId === item.productId);

      if (existing) {
        return prev.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: normalizeQuantity(cartItem.quantity + normalizedQuantity) }
            : cartItem,
        );
      }

      return [...prev, { ...item, quantity: normalizedQuantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((cartItem) => cartItem.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!Number.isFinite(quantity) || quantity < 1) {
      setItems((prev) => prev.filter((cartItem) => cartItem.productId !== productId));
      return;
    }

    const normalizedQuantity = normalizeQuantity(quantity);

    setItems((prev) =>
      prev.map((cartItem) =>
        cartItem.productId === productId ? { ...cartItem, quantity: normalizedQuantity } : cartItem,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, cartItem) => sum + cartItem.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, cartItem) => sum + cartItem.unitPrice * cartItem.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }),
    [items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}
