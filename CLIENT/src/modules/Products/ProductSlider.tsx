import styles from "@/styles/productslider.module.css";
import { dummyProducts } from "@/scripts/dummyData";


const ProductSlider = () => {

  return (
    <div className={styles.sliderRow}>
      {dummyProducts.map((product) => (
        <div key={product.id} className={styles.card}>
          <div className={styles.imageWrapper}>
            <img src={product.imageUrl} alt={product.name} className={styles.image} />
          </div>
          <div className={styles.details}>
            <h3 className={styles.name}>{product.name}</h3>
            <p className={styles.description}>{product.description}</p>
            <div className={styles.priceRow}>
              <span className={styles.price}>₹{product.price}</span>
              <span className={styles.cutPrice}>₹{product.cutPrice}</span>
              <span className={styles.discount}>{product.discount}% off</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSlider;
