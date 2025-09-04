import { useEffect, useState } from "react";
import styles from "./design/productList.module.css";
import { Star } from "lucide-react";
import { useGlobalContext } from "@/context/Context";
import { useNavigate, useParams } from "react-router-dom";
import { useCartStore, useAuthStore } from "@/context";
import type { CartItem } from "@/interface";
import { addToCart, updateCartQuantity } from "@/services/cart";
import { useNotify } from "@/modules/Prompts/notify";
import Overlay from "@/modules/Loaders/Overlay";


export function ProductsList() {

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <div className={styles.container}>

            <aside className={styles.sidebar}>
                <h3>PRODUCT CATEGORIES</h3>
                <ul>
                    <li>
                        <label>
                            <input type="radio" name="cat" /> Men
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="cat" /> Women
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="cat" /> Laptops
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="cat" /> Smart Watch Accessories
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="cat" /> Cameras
                        </label>
                    </li>
                </ul>

                <div className={styles.filter}>
                    <h3>FILTER BY PRICE</h3>
                    <input type="range" min="100" max="100000" />
                    <div className={styles.priceLabels}>
                        <span>From: Rs: 100</span>
                        <span>To: Rs: 100000</span>
                    </div>
                </div>

                <div className={styles.filter}>
                    <h3>FILTER BY RATING</h3>
                    {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className={styles.ratingRow}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i < stars ? "gold" : "transparent"}
                                    stroke={i < stars ? "gold" : "#cfcfcf"}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </aside>

            {
                loading ?
                    <div className={styles.skeletonLoaderContainer}>
                        <ProductsListSkeleton />
                    </div>
                    :
                    <ActualProducts />
            }

        </div>
    );
}

export default function ActualProducts() {
  
    const { products, setProducts } = useGlobalContext();
    const { category } = useParams<{ category: string }>();
    const { addCartItem, removeItem } = useCartStore();
    const { userData } = useAuthStore();
    const navigate = useNavigate();
    const notify = useNotify();
    const [busy, setBusy] = useState(false);

    const handleAddToCart = async (id: string) => {
        if (busy) return;
        setBusy(true);
        const product = products.get(id);
        if (!product) return;

        const cartMap = useCartStore.getState().cartItems;
        const existing = cartMap ? cartMap.get(id as string) : undefined;
        if (existing) {
            notify("Product already in cart", "message");
            return;
        }

        const updated = new Map(products);
        updated.set(id, { ...product, quantity: 1 });
        setProducts(updated);

        const item: Omit<CartItem, "quantity"> = {
            _id: product._id,
            name: product.name,
            price: product.discountedPrice,
            imageUrl: product.productImage,
        };
        addCartItem(item, 1);

        if (userData && (userData as any).id) {
            const { ok, data } = await addToCart({ userId: (userData as any).id, productId: item._id, quantity: 1, name: item.name, price: item.price, imageUrl: item.imageUrl });
            if (!ok && data?.errorMessage === "Product already in cart") {
                notify("Product already in cart", "message");
            }
        }
        setBusy(false);
    };

    const handleIncrement = async (id: string) => {
        if (busy) return;
        setBusy(true);
        const product = products.get(id);
        if (!product) return;

        const updated = new Map(products);
        updated.set(id, { ...product, quantity: product.quantity + 1 });
        setProducts(updated);

        const item: Omit<CartItem, "quantity"> = {
            _id: product._id,
            name: product.name,
            price: product.discountedPrice,
            imageUrl: product.productImage,
        };
        addCartItem(item, 1);

        if (userData && (userData as any).id) {
            const qty = product.quantity + 1;
            await updateCartQuantity({ userId: (userData as any).id, productId: item._id, quantity: qty });
        }
        setBusy(false);
    };

    const handleDecrement = async (id: string) => {
        if (busy) return;
        setBusy(true);
        const product = products.get(id);
        if (!product) return;

        const updated = new Map(products);
        const newQty = Math.max(0, product.quantity - 1);
        updated.set(id, { ...product, quantity: newQty });
        setProducts(updated);

        removeItem(product._id, 1);

        if (userData && (userData as any).id) {
            await updateCartQuantity({ userId: (userData as any).id, productId: product._id, quantity: newQty });
        }
        setBusy(false);
    };

    const filteredProducts = Array.from(products.values()).filter(
        (p: any) => p.category.toLowerCase() === category?.toLowerCase()
    );

    if (filteredProducts.length === 0) {
        return <p className={styles.noProducts}>No products found in this category.</p>;
    }

    return (
        <div className={styles.productsArea}>
            <Overlay show={busy} message="Updating your cart..." />
            {filteredProducts.map((product: any) => (
            <div  key={product._id} className={styles.card}>
                   
                    <div onClick={() => navigate(`/product/${product._id}`)}  className={styles.media}>
                        <img src={product.productImage} alt={product.name} />
                        {product.discount > 0 && (
                            <span className={styles.discountBadge}>{product.discount}%</span>
                        )}
                    </div>

                    <div className={styles.details}>
                        <h4 className={styles.name}>{product.name}</h4>
                        <p className={styles.stock}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                        </p>

                        <div className={styles.rating}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i < product.rating ? "gold" : "transparent"}
                                    stroke={i < product.rating ? "gold" : "#cfcfcf"}
                                />
                            ))}
                        </div>

                        <div className={styles.price}>
                            <span className={styles.oldPrice}>Rs {product.actualPrice}</span>
                            <span className={styles.newPrice}>Rs {product.discountedPrice}</span>
                        </div>

                        {product.quantity === 0 ? (
                            <button
                                className={styles.addBtn}
                                onClick={() => handleAddToCart(product._id)}
                            >
                                Add to Cart
                            </button>
                        ) : (
                            <div className={styles.cartActions}>
                                <button onClick={() => handleDecrement(product._id)}>-</button>
                                <span>{product.quantity}</span>
                                <button onClick={() => handleIncrement(product._id)}>+</button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function ProductsListSkeleton({ count = 10 }: { count?: number }) {
    return (
        <div className={`${styles.productsArea}`}>
            {Array.from({ length: count }).map((_, idx) => (
                <div className={`${styles.card} ${styles.skeletonCard}`} key={idx}>
                    <div className={`${styles.media} ${styles.skeletonBox}`} />
                    <div className={styles.details}>
                        <div className={`${styles.skeletonText} ${styles.w80}`} />
                        <div className={`${styles.skeletonText} ${styles.w60}`} />
                        <div className={`${styles.skeletonText} ${styles.w50}`} />
                        <div className={`${styles.skeletonPriceRow}`}>
                            <div className={`${styles.skeletonText} ${styles.w60}`} />
                            <div className={`${styles.skeletonText} ${styles.w50}`} />
                        </div>
                        <div className={styles.skeletonBtn} />
                    </div>
                </div>
            ))}
        </div>
    );
}