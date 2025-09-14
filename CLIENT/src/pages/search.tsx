import React, { useState } from "react";
import styles from "@/styles/search.module.css";
import { Search } from "lucide-react";
import { searchProducts } from "@/services/products";
import { useNavigate } from "react-router-dom";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const products = await searchProducts(query);
      setResults(products);
    } catch (err: any) {
      setError("Failed to search products.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.searchPage}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          <Search size={20} />
        </button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.results}>
        {results.length === 0 && !loading && <div>No products found.</div>}
        {results.map((product: any) => (
          <div key={product._id} onClick={() => navigate(`/product/${product._id}`)} className={styles.productItem}>
            <img src={product.productImage} alt={product.name} className={styles.productImage} />
            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <span>${product.discountedPrice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
