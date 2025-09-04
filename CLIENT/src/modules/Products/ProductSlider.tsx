import styles from "@/styles/productslider.module.css";
import { useGlobalContext } from "@/context/Context";
import { useMemo, useState } from "react";
import Overlay from "@/modules/Loaders/Overlay";
import { useNavigate } from "react-router-dom";


const ProductSlider = () => {
  const { products, performCartAction } = useGlobalContext();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const popular = useMemo(() => {
    const base = products ? products : new Map<string, any>();
    const list = Array.from(base.values());
    list.sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0) || (b.discount ?? 0) - (a.discount ?? 0));
    return list.slice(0, 20);
  }, [products]);

  const handleAdd = async (id: string) => {
    if (busy) return;
    setBusy(true);
    const product = products ? products.get(id) : null;
    if (!product) { setBusy(false); return; }

    await performCartAction(product, "add");
    setBusy(false);
  };

  const handleInc = async (id: string) => {
    if (busy) return;
    setBusy(true);
    const product = products ? products.get(id) : null;
    if (!product) { setBusy(false); return; }

    await performCartAction(product, "inc");
    setBusy(false);
  };

  const handleDec = async (id: string) => {
    if (busy) return;
    setBusy(true);
    const product = products ? products.get(id) : null;
    if (!product) { setBusy(false); return; }

    await performCartAction(product, "dec");
    setBusy(false);
  };

  return (
    <div className={styles.sliderRow}>
      <Overlay show={busy} message="Updating your cart..." />
      {popular.map((product: any) => (
        <div  key={product._id} className={styles.card}>
         
          <div  onClick={() => navigate(`/product/${product._id}`)} className={styles.imageWrapper}>
            {product.discount ? <span className={styles.discountBadge}>-{product.discount}%</span> : null}
            <img src={product.productImage} alt={product.name} className={styles.image} />
          </div>

          <div className={styles.details}>
            <h3 className={styles.name}>{product.name}</h3>
            {product.description ? (
              <span className={styles.description} style={{ height: "100%" }}>
                {product.description.length > 80
                  ? `${product.description.slice(0, 80)}...`
                  : product.description}
              </span>
            ) : null}
            <div className={styles.priceRow}>
              <span className={styles.price}>₹{product.discountedPrice}</span>
              <span className={styles.cutPrice}>₹{product.actualPrice}</span>
              {product.discount ? <span className={styles.discount}>{product.discount}% off</span> : null}
            </div>
            {product.quantity === 0 ? (
              <button className={styles.addBtn} onClick={() => handleAdd(product._id)}>Add to Cart</button>
            ) : (
              <div className={styles.counter}>
                <button onClick={() => handleDec(product._id)}>-</button>
                <span>{product.quantity}</span>
                <button onClick={() => handleInc(product._id)}>+</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSlider;
