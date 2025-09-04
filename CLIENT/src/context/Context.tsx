import { createContext, use, useContext, useEffect, useState } from "react";
import { lookForUserData } from "../utils";
import { useAuthStore } from ".";
import { fetchProducts } from "@/services/products";
import type { CartItem } from "../interface";

interface GlobalContextProps {
    handleGetUserData: () => void;
    products: any | null;
    setNotify: React.Dispatch<React.SetStateAction<{ message: string, type: string } | null>>;
    notification: { message: string, type: string } | null;
    setProducts: React.Dispatch<React.SetStateAction<Map<any, any>>>;
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

    const { setUserData } = useAuthStore();
    const [notification, setNotify] = useState<{ message: string, type: string } | null>(null);
    const [products, setProducts] = useState<Map<string, any>>(new Map());



    const handleGetUserData = () => {

        const data = lookForUserData();
        console.log(data);
        if (!data) return;

        setUserData(data);

    }

    useEffect(() => {
        (async () => {
            const resultProducts: Omit<any, "quantity">[] = await fetchProducts();

            const getPersistedCartData = (): Map<string, CartItem> => {
                try {
                    const cartData = localStorage.getItem("cart-storage");
                    if (cartData) {
                        const parsed = JSON.parse(cartData);
                        if (parsed.state && Array.isArray(parsed.state.cartItems)) {
                            return new Map(parsed.state.cartItems);
                        }
                    }
                } catch (error) {
                    console.error("Error loading cart data from localStorage:", error);
                }
                return new Map();
            };

            const persistedCartItems = getPersistedCartData();

            const productMap = new Map<string, any>(
                resultProducts.map((product) => {
                    const cartItem = persistedCartItems.get(product._id);
                    const quantity = cartItem ? cartItem.quantity : 0;

                    return [
                        product._id,
                        { ...product, quantity },
                    ];
                })
            );

            setProducts(productMap);
        })();
    }, []);

    useEffect(() => {
        handleGetUserData();
    }, [setUserData]);



    return (
        <GlobalContext.Provider value={{ notification , setNotify , handleGetUserData, products, setProducts }}>
            {children}
        </GlobalContext.Provider>
    )

}


