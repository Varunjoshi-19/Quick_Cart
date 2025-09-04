import { useEffect, useState } from "react";
import styles from "./design/productList.module.css";
import { Star } from "lucide-react";
import { useGlobalContext } from "@/context/Context";
import { useParams } from "react-router-dom";


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

    const handleAddToCart = (id: string) => {
        const product = products.get(id);
        if (product) {
            const updated = new Map(products);
            updated.set(id, { ...product, quantity: 1 });
            setProducts(updated);
        }
    };

    const handleIncrement = (id: string) => {
        const product = products.get(id);
        if (product) {
            const updated = new Map(products);
            updated.set(id, { ...product, quantity: product.quantity + 1 });
            setProducts(updated);
        }
    };

    const handleDecrement = (id: string) => {
        const product = products.get(id);
        if (product && product.quantity > 0) {
            const updated = new Map(products);
            updated.set(id, { ...product, quantity: product.quantity - 1 });
            setProducts(updated);
        }
    };

    const filteredProducts = Array.from(products.values()).filter(
        (p: any) => p.category.toLowerCase() === category?.toLowerCase()
    );

    if (filteredProducts.length === 0) {
        return <p className={styles.noProducts}>No products found in this category.</p>;
    }

    return (
        <div className={styles.productsArea}>
            {filteredProducts.map((product: any) => (
                <div key={product._id} className={styles.card}>
                    <div className={styles.media}>
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
                        <div className={`${styles.skeletonText} ${styles.w50}`} />
                        <div className={`${styles.skeletonText} ${styles.w60}`} />
                    </div>
                </div>
            ))}
        </div>
    );
}