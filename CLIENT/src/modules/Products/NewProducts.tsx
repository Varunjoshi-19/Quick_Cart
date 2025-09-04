import styles from "@/styles/newProuduct.module.css";
import { useGlobalContext } from "@/context/Context";
import { useState } from "react";
import { Star } from "lucide-react";
import { useNotify } from "@/modules/Prompts/notify";
import { useNavigate } from "react-router-dom";

interface ProductItemProps {
  product: any;
  onAddToCart: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onAddToCart, onIncrement, onDecrement }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const navigate = useNavigate();
  return (
    <div className={styles.card}>

      <div onClick={() => navigate(`/product/${product._id}`)} className={styles.imageWrapper}>
        <img
          src={product.productImage}
          alt={product.name}
          className={styles.image}
        />
        {product.discount > 0 && (
          <span className={styles.discountTag}>
            {product.discount}% OFF
          </span>
        )}
      </div>

      <h3 className={styles.title}>{product.name}</h3>

      <div className={styles.rating}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < product.rating ? styles.starFilled : styles.starEmpty}
          />
        ))}
      </div>

      <p className={styles.description}>
        {showFullDesc
          ? product.description
          : product.description.slice(0, 80) + "..."}
        {product.description.length > 80 && (
          <button
            className={styles.readMore}
            onClick={() => setShowFullDesc(!showFullDesc)}
          >
            {showFullDesc ? "Read less" : "Read more"}
          </button>
        )}
      </p>

      <div className={styles.priceWrapper}>
        <span className={styles.discountedPrice}>₹{product.discountedPrice}</span>
        <span className={styles.actualPrice}>₹{product.actualPrice}</span>
      </div>

      {product.quantity === 0 ? (
        <button
          className={styles.addBtn}
          onClick={() => onAddToCart(product._id)}
        >
          Add to Cart
        </button>
      ) : (
        <div className={styles.counter}>
          <button onClick={() => onDecrement(product._id)}>-</button>
          <span>{product.quantity}</span>
          <button onClick={() => onIncrement(product._id)}>+</button>
        </div>
      )}
    </div>
  );
};

const NewProducts: React.FC = () => {
  const { products, performCartAction } = useGlobalContext();
  const notify = useNotify();

  const handleAddToCart = async (id: string) => {
    const product = products.get(id);
    if (!product) return;
    await performCartAction(product, "add");
  };

  const handleIncrement = async (id: string) => {
    const product = products.get(id);
    if (!product) return;
    await performCartAction(product, "inc");
  };

  const handleDecrement = async (id: string) => {
    const product = products.get(id);
    if (!product) return;
    await performCartAction(product, "dec");
  };

  return (
    <div className={styles.container}>
      {Array.from(products.values())
        .slice(0, 30) // take only 30
        .map((product: any) => (
          <ProductItem
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        ))}

    </div>
  );
};



export default NewProducts;
