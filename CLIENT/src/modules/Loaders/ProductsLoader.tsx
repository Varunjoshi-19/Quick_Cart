import styles from "@/modules/Loaders/productsloader.module.css";

const ProductsLoader = () => {
  return (
    <div className={styles.loaderRow}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.image}></div>
          <div className={styles.text}></div>
          <div className={styles.textSmall}></div>
        </div>
      ))}
    </div>
  );
};

export default ProductsLoader;
