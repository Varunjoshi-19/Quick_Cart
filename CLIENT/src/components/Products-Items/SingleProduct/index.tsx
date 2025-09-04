import React, { useState } from "react";
import styles from "../design/singleproduct.module.css";
import { Heart, Share2, Star, Minus, Plus } from "lucide-react";

interface SingleProductProps {
    title: string;
    brand: string;
    rating: number;
    reviews: number;
    oldPrice: number;
    newPrice: number;
    discount: string;
    stockStatus: string;
    imageSrc: string;
    description?: string;
    quantity?: number;
    onAdd?: () => void;
    onInc?: () => void;
    onDec?: () => void;
}

interface ProductTabsProps {
    description: string;
    additionalInfo: string;
    reviews: string;
    reviewCount: number;
}


const SingleProductMiddle: React.FC<SingleProductProps> = ({
    title,
    brand,
    rating,
    reviews,
    oldPrice,
    newPrice,
    discount,
    stockStatus,
    imageSrc,
    description,
    quantity = 0,
    onAdd,
    onInc,
    onDec,
}) => {
    return (
        <div style={{ display: "flex", flexDirection: "column"  , justifyContent : "center" ,alignItems : "center"}}>
            <div className={styles.productContainer}>

                <div className={styles.imageSection}>
                    <span className={styles.discountBadge}>{discount}</span>
                    <img src={imageSrc} alt={title} className={styles.mainImage} />
                    <div className={styles.thumbnailRow}>
                        <img src={imageSrc} alt="thumbnail" />
                        <img src={imageSrc} alt="thumbnail" />
                    </div>
                </div>

                <div className={styles.detailsSection}>
                    <h2 className={styles.productTitle}>{title}</h2>
                    <p className={styles.brand}>
                        Brands : <span>{brand}</span>
                    </p>
                    <div className={styles.ratingRow}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                fill={i < rating ? "#FFD700" : "none"}
                                stroke="#FFD700"
                            />
                        ))}
                        <span className={styles.reviewCount}>{reviews} Review</span>
                    </div>

                    <div className={styles.priceRow}>
                        <span className={styles.oldPrice}>Rs. {oldPrice}</span>
                        <span className={styles.newPrice}>Rs. {newPrice}</span>
                    </div>

                    <p
                        className={
                            stockStatus === "IN STOCK"
                                ? styles.inStock
                                : styles.outOfStock
                        }
                    >
                        {stockStatus}
                    </p>

                    {description && (
                        <p className={styles.description}>{description}</p>
                    )}

                    <div className={styles.actionRow}>
                        {quantity > 0 ? (
                            <div className={styles.quantity}>
                                <button onClick={onDec}>
                                    <Minus size={16} />
                                </button>
                                <span>{quantity}</span>
                                <button onClick={onInc}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        ) : (
                            <button className={styles.cartBtn} onClick={onAdd}>Add To Cart</button>
                        )}
                        <button className={styles.iconBtn}>
                            <Heart size={18} />
                        </button>
                        <button className={styles.iconBtn}>
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>

            </div>
            <ProductTabs description="something something" additionalInfo="s" reviews="4" reviewCount={3} />
        </div>
    );
};



const ProductTabs: React.FC<ProductTabsProps> = ({
    description,
    additionalInfo,
    reviews,
    reviewCount,
}) => {
    const [activeTab, setActiveTab] = useState("description");

    return (
        <div className={styles.tabsContainer}>
            {/* Tab Buttons */}
            <div className={styles.tabButtons}>
                <button
                    className={`${styles.tabBtn} ${activeTab === "description" ? styles.active : ""
                        }`}
                    onClick={() => setActiveTab("description")}
                >
                    Description
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === "info" ? styles.active : ""
                        }`}
                    onClick={() => setActiveTab("info")}
                >
                    Additional Info
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === "reviews" ? styles.active : ""
                        }`}
                    onClick={() => setActiveTab("reviews")}
                >
                    Reviews ({reviewCount})
                </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
                {activeTab === "description" && <p>{description}</p>}
                {activeTab === "info" && <p>{additionalInfo}</p>}
                {activeTab === "reviews" && <p>{reviews}</p>}
            </div>
        </div>
    );
};




export { SingleProductMiddle };
