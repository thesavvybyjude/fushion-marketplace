import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string; // unique id for cart item (productId + variantId)
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  vendorId: string;
  vendorName: string;
  image?: string;
  variantId?: string;
  variantName?: string;
  maxStock?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // Computed values
  getTotalItems: () => number;
  getSubtotal: () => number;
  getGroupedByVendor: () => Record<string, CartItem[]>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const id = newItem.variantId
            ? `${newItem.productId}-${newItem.variantId}`
            : newItem.productId;

          const existingItemIndex = state.items.findIndex((item) => item.id === id);

          if (existingItemIndex >= 0) {
            // Update quantity of existing item
            const newItems = [...state.items];
            const newQuantity = newItems[existingItemIndex].quantity + newItem.quantity;
            
            // Cap at max stock if provided
            newItems[existingItemIndex].quantity = newItem.maxStock 
              ? Math.min(newQuantity, newItem.maxStock) 
              : newQuantity;
              
            return { items: newItems };
          }

          // Add new item
          return { items: [...state.items, { ...newItem, id }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== id) };
          }

          return {
            items: state.items.map((item) => {
              if (item.id === id) {
                // Cap at max stock if provided
                const finalQty = item.maxStock ? Math.min(quantity, item.maxStock) : quantity;
                return { ...item, quantity: finalQty };
              }
              return item;
            }),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getGroupedByVendor: () => {
        const items = get().items;
        const grouped: Record<string, CartItem[]> = {};

        items.forEach((item) => {
          if (!grouped[item.vendorId]) {
            grouped[item.vendorId] = [];
          }
          grouped[item.vendorId].push(item);
        });

        return grouped;
      },
    }),
    {
      name: 'fushion-cart', // localStorage key
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // we will manually rehydrate to avoid SSR mismatch
    }
  )
);
