import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUserDataProps } from "../interface";
import type { CartStoreState, CartItem } from "../interface";


export const useAuthStore = create<AuthUserDataProps>((set) => ({
    userData: "null",
    setUserData: (data: any) => set(() => ({
        userData: data
    })),
    removeUser: () => set(() => {
        localStorage.removeItem("user-data");
        return { userData: null };
    })
}));

export const useCartStore = create<CartStoreState>()(

    persist(
        (set, get) => ({
            cartItems: null,

            addCartItem: (item, quantity = 1) => set((state) => {
                const currentItems = new Map(state.cartItems);
                const existing = currentItems.get(item._id);
                const updated: CartItem = existing
                    ? { ...existing, quantity: existing.quantity + quantity }
                    : { ...item, quantity } as CartItem;
                currentItems.set(item._id, updated);
                return { cartItems: currentItems };
            }),

            removeItem: (productId, quantity = 1) => set((state) => {
                const currentItems = new Map(state.cartItems);
                const existing = currentItems.get(productId);
                if (!existing) return { cartItems: currentItems };
                const newQty = existing.quantity - quantity;
                if (newQty > 0) {
                    currentItems.set(productId, { ...existing, quantity: newQty });
                } else {
                    currentItems.delete(productId);
                }

                if (currentItems.size === 0) {
                    return { cartItems: new Map<string, CartItem>() };
                }
                return { cartItems: currentItems };
            }),

            clearCart: () => set(() => ({ cartItems: new Map<string, CartItem>() }))
        }),
        {
            name: "cart-storage",

            partialize: (state) => ({
                cartItems: state.cartItems ? Array.from(state.cartItems.entries()) : []
            }),

            onRehydrateStorage: () => (state) => {
                if (state && Array.isArray(state.cartItems)) {
                    state.cartItems = new Map(state.cartItems);
                }
            }
        }
    )
);