
import React, { useState, useEffect } from 'react';
import { fetchProducts } from '@/services/products';
import styles from '@/styles/searchBarProducts.module.css';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  productImage?: string;
  discountedPrice: number;
}

interface SearchBarProductsProps {
  query: string;
  onSelect: (product: Product) => void;
}

const SearchBarProducts: React.FC<SearchBarProductsProps> = ({ query, onSelect }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
 
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts().then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    setFiltered(
      products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, products]);

  return (
    <div className={styles.searchBarProductsContainer}>
      {filtered.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <ul className={styles.productsList}>
          {filtered.map((product) => (
            <li  key={product._id} className={styles.productItem} onClick={() => onSelect(product)}>
              <img
                src={product.productImage ? product.productImage : require('@/assets/default.jpg')}
                alt={product.name}
                className={styles.productImage}
                onError={e => { (e.target as HTMLImageElement).src = require('@/assets/default.jpg'); }}
              />
              <div className={styles.productInfo}>
                <span className={styles.productName}>{product.name}</span>
                <span className={styles.productPrice}>₹{product.discountedPrice}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBarProducts;
