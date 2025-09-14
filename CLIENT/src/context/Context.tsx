import { createContext, use, useContext, useEffect, useState } from "react";
import { lookForUserData } from "../utils";
import { useAuthStore, useCartStore, syncCartFromServer } from ".";
import { fetchProducts } from "@/services/products";
import { addToCart as apiAddToCart, updateCartQuantity as apiUpdateQty, removeFromCart as apiRemove } from "@/services/cart";
import type { CartItem } from "@/interface";

interface GlobalContextProps {
    handleGetUserData: () => void;
    products: any | null;
    setNotify: React.Dispatch<React.SetStateAction<{ message: string, type: string } | null>>;
    notification: { message: string, type: string } | null;
    setProducts: React.Dispatch<React.SetStateAction<Map<any, any>>>;
    addOrIncrementProduct: (product: any) => Promise<void>;
    decrementProduct: (product: any) => Promise<void>;
    currentCountry: string;
    setCurrentCountry: React.Dispatch<React.SetStateAction<string>>;
    performCartAction: (product: any, action: "add" | "inc" | "dec") => Promise<void>;
}


const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);;

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("Context not available!")
    }

    return context;
}


export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {

    const { setUserData, userData } = useAuthStore();
    const { cartItems, addCartItem, removeItem } = useCartStore();
    const [notification, setNotify] = useState<{ message: string, type: string } | null>(null);
    const [products, setProducts] = useState<Map<string, any>>(new Map());
    const [currentCountry, setCurrentCountry] = useState<string>("---");


    const handleGetUserData = async () => {

        const data = lookForUserData();
        
        if (!data) return;

        setUserData(data);
        if (data?.id) {
            await syncCartFromServer(data.id);
        }

    }

    useEffect(() => {
        (async () => {

            const resultProducts: Omit<any, "quantity">[] = await fetchProducts();
            const productMap = new Map<string, any>(
                resultProducts.map((product) => [
                    product._id,
                    { ...product, quantity: 0 },
                ])
            );

            setProducts(productMap);
        })();

        (() => {
            const country = localStorage.getItem("country");
            setCurrentCountry(country || "---");
        })();
    }, []);

    useEffect(() => {
        if (!products) return;
        setProducts((prev) => {
            const next = new Map(prev);
            if (cartItems && cartItems.size > 0) {
                for (const [productId, cartItem] of cartItems.entries()) {
                    const existing = next.get(productId);
                    if (existing) {
                        next.set(productId, { ...existing, quantity: cartItem.quantity });
                    }
                }
            } else {
                for (const [pid, prod] of next.entries()) {
                    next.set(pid, { ...prod, quantity: 0 });
                }
            }
            return next;
        });
    }, [cartItems]);

    useEffect(() => {
        handleGetUserData();
    }, [setUserData]);



    async function addOrIncrementProduct(product: any) {
        if (!product || !product._id) return;
        if (!userData) {
            setNotify({ message: "Login to add items to cart", type: "error" });
            return;
        }

        setProducts(prev => {
            const m = new Map(prev);
            const p = m.get(product._id);
            const quantity = p ? (p.quantity || 0) + 1 : 1;
            m.set(product._id, { ...product, quantity });
            return m;
        });

        const item: Omit<CartItem, "quantity"> = {
            _id: product._id,
            name: product.name,
            price: product.discountedPrice ?? product.price ?? 0,
            imageUrl: product.productImage,
        };
        addCartItem(item, 1);

        const uid = (userData as any)?.id as string | undefined;
        if (uid) {
            const exists = cartItems ? cartItems.get(product._id) : undefined;
            if (exists) {
                await apiUpdateQty({ userId: uid, productId: product._id, quantity: exists.quantity + 1 });
            } else {
                await apiAddToCart({ userId: uid, productId: product._id, quantity: 1, name: item.name, price: item.price, imageUrl: item.imageUrl });
            }
        }
    }

    async function decrementProduct(product: any) {
        if (!product || !product._id) return;
        if (!userData) return;
        setProducts(prev => {
            const m = new Map(prev);
            const p = m.get(product._id);
            if (p) m.set(product._id, { ...p, quantity: Math.max(0, (p.quantity || 0) - 1) });
            return m;
        });

        removeItem(product._id, 1);

        const uid = (userData as any)?.id as string | undefined;
        if (uid) {
            const exists = cartItems ? cartItems.get(product._id) : undefined;
            const nextQty = Math.max(0, (exists?.quantity || 1) - 1);
            if (nextQty <= 0) {
                await apiRemove({ userId: uid, productId: product._id });
            } else {
                await apiUpdateQty({ userId: uid, productId: product._id, quantity: nextQty });
            }
        }
    }

    async function performCartAction(product: any, action: "add" | "inc" | "dec") {
        if (!userData) return;
        if (action === "dec") {
            await decrementProduct(product);
            return;
        }
        await addOrIncrementProduct(product);
    }

    return (
        <GlobalContext.Provider value={{
            notification,
            setCurrentCountry, currentCountry,
            setNotify, handleGetUserData, products, setProducts, addOrIncrementProduct, decrementProduct, performCartAction
        }}>
            {children}
        </GlobalContext.Provider>
    )

}


