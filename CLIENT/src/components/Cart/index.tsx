import { Home } from "lucide-react";
import emptyCartStyles from "./design/emptycart.module.css";
import cart from "@/assets/cart.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./design/Itemcart.module.css";
import { X, Minus, Plus } from "lucide-react";
import { useCartStore, useAuthStore } from "@/context";
import type { CartItem as StoreCartItem } from "@/interface";
import { useGlobalContext } from "@/context/Context";
import { updateCartQuantity, removeFromCart } from "@/services/cart";
import Overlay from "@/modules/Loaders/Overlay";


interface EmptyListProps {
    name: string;
    listName: string;
    listDesc: string;
}


export const EmptyList = ({ name, listName, listDesc }: EmptyListProps) => {

    const navigate = useNavigate();


    return (
        <div className={emptyCartStyles.emptyCartWrapper}>
            <div className={emptyCartStyles.cartContent}>
                <img
                    src={cart}
                    alt="Empty cart"
                    className={emptyCartStyles.cartImage}
                />
                <p className={emptyCartStyles.emptyText}>{listDesc}</p>
                <button onClick={() => navigate("/")} data-ripple className={emptyCartStyles.continueBtn}>
                    <Home />
                    <span>Continue Shopping</span>
                </button>
            </div>
        </div>
    );
};


export const ItemCart = () => {

    const { addCartItem, removeItem, cartItems } = useCartStore();
    const { userData } = useAuthStore();
    const { setProducts } = useGlobalContext();
    const navigate = useNavigate();
    const [busy, setBusy] = useState(false);

    const itemsArray = cartItems ? Array.from(cartItems.values()) : [];

    const handleIncrement = async (item: StoreCartItem) => {
        if (busy) return;
        setBusy(true);
        const payload = {
            _id: item._id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
        };
        addCartItem(payload, 1);
        setProducts(previousProducts => {
            const newMap = new Map(previousProducts);
            const currentItem = newMap.get(item._id);
            if (currentItem) {
                newMap.set(item._id, { ...currentItem, quantity: currentItem.quantity + 1 });
            }
            return newMap;
        });

        if ((userData as any)?.id) {
            const newQty = item.quantity + 1;
            await updateCartQuantity({ userId: (userData as any).id, productId: item._id, quantity: newQty });
        }
        setBusy(false);
    };

    const handleDecrement = async (item: StoreCartItem) => {
        if (busy) return;
        setBusy(true);
        removeItem(item._id, 1);
        setProducts(previousProducts => {
            const newMap = new Map(previousProducts);
            const currentItem = newMap.get(item._id);
            if (currentItem) {
                const newQuantity = Math.max(0, currentItem.quantity - 1);
                newMap.set(item._id, { ...currentItem, quantity: newQuantity });
            }
            return newMap;
        });

        if ((userData as any)?.id) {
            const newQty = Math.max(0, item.quantity - 1);
            await updateCartQuantity({ userId: (userData as any).id, productId: item._id, quantity: newQty });
        }
        setBusy(false);
    };

    const handleRemove = async (item: StoreCartItem) => {
        if (busy) return;
        setBusy(true);
        removeItem(item._id, item.quantity);
        setProducts(previousProducts => {
            const newMap = new Map(previousProducts);
            const currentItem = newMap.get(item._id);
            if (currentItem) {
                newMap.set(item._id, { ...currentItem, quantity: 0 });
            }
            return newMap;
        });

        if ((userData as any)?.id) {
            await removeFromCart({ userId: (userData as any).id, productId: item._id });
        }
        setBusy(false);
    };

    const subtotal = itemsArray.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className={styles.cartContainer}>
            <Overlay show={busy} message="Updating your cart..." />


            <div className={styles.cartTable}>
                <div className={styles.cartHeader}>
                    <span>Product</span>
                    <span>Unit Price</span>
                    <span>Quantity</span>
                    <span>Subtotal</span>
                    <span>Remove</span>
                </div>
                {itemsArray.map((item) => (
                    <div key={item._id} className={styles.cartRow}>
                        <div className={styles.productInfo}>
                            <img src={item.imageUrl || ""} alt={item.name} />
                            <div>
                                <p>{item.name}</p>
                            </div>
                        </div>
                        <div>Rs {item.price}</div>
                        <div className={styles.quantity}>
                            <button onClick={() => handleDecrement(item)}>
                                <Minus size={16} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleIncrement(item)}>
                                <Plus size={16} />
                            </button>
                        </div>
                        <div>Rs. {item.price * item.quantity}</div>
                        <div>
                            <button
                                className={styles.removeBtn}
                                onClick={() => handleRemove(item)}
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Totals */}
            <div className={styles.cartTotals}>
                <h3>CART TOTALS</h3>
                <div className={styles.totalsRow}>
                    <span>Subtotal</span>
                    <span className={styles.price}>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className={styles.totalsRow}>
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div className={styles.totalsRow}>
                    <span>Estimate for</span>
                    <span>India</span>
                </div>
                <div className={styles.totalsRow}>
                    <span>Total</span>
                    <span className={styles.price}>₹{subtotal.toLocaleString()}</span>
                </div>
                <button onClick={() => navigate("/checkout")} className={styles.checkoutBtn}>Checkout</button>
            </div>


        </div>
    );
};



