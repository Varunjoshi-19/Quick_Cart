export interface SignUpProps {
    name: string,
    email: string;
    password: string;
}

export interface SignInProps {
    email: string;
    password: string;
}

export interface userDataProps {
    id : string;
    imageData : {
         fileId : string,
         url : string
    },
    provider : string;
    providerId : string;
    name: string;
    email: string;
}


export interface AuthUserDataProps {

    userData: any | { [key: string]: userDataProps } | null;
    setUserData: (data: any) => void;
    removeUser: () => void;

}

export interface CartItem {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
    quantity: number;
}

export interface CartStoreState {
    cartItems: Map<string, CartItem> | null;
    addCartItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeItem: (productId: string, quantity?: number) => void;
    clearCart: () => void;
}