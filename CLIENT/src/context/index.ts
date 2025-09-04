import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUserDataProps } from "../interface";
import type { CartStoreState, CartItem } from "../interface";
import { fetchUserCart } from "@/services/cart";


export const useAuthStore = create<AuthUserDataProps>((set) => ({
    userData: null,
    setUserData: (data: any) => set(() => ({
        userData: data
    })),
    removeUser: () => set(() => {
        localStorage.removeItem("user-data");
        return { userData: null };
    })
}));

export const useCartStore = create<CartStoreState>((set, get) => ({
    cartItems: new Map<string, CartItem>(),

    addCartItem: (item, quantity = 1) =>
        set((state) => {
            const currentItems = new Map(state.cartItems);
            const existing = currentItems.get(item._id);

            const updated: CartItem = existing
                ? { ...existing, quantity: existing.quantity + quantity }
                : { ...item, quantity };

            currentItems.set(item._id, updated);
            return { cartItems: currentItems };
        }),

    removeItem: (productId, quantity = 1) =>
        set((state) => {
            const currentItems = new Map(state.cartItems);
            const existing = currentItems.get(productId);
            if (!existing) return { cartItems: currentItems };

            const newQty = existing.quantity - quantity;
            if (newQty > 0) {
                currentItems.set(productId, { ...existing, quantity: newQty });
            } else {
                currentItems.delete(productId);
            }

            return { cartItems: currentItems };
        }),

    clearCart: () => set(() => ({ cartItems: new Map<string, CartItem>() })),
}));

export async function syncCartFromServer(userId: string) {
    try {
        const result = await fetchUserCart(userId);
        const items = result?.items || [];
        if (!Array.isArray(items)) return;

        const mapped = new Map<string, CartItem>();
        items.forEach((ci: any) => {
            mapped.set(ci.productId, {
                _id: ci.productId,
                name: ci.name || "",
                price: Number(ci.price) || 0,
                imageUrl: ci.imageUrl || "",
                quantity: ci.quantity
            });
        });

        const setFn = (useCartStore as any).setState as (partial: any) => void;
        setFn({ cartItems: mapped });
    } catch (e) {
        // ignore
    }
}