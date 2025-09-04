import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import styles from "@/styles/menuoption.module.css"
import { useNavigate } from "react-router-dom";
import { scrollToTop } from "@/utils";


function MenuOptionBar() {

  const navigate = useNavigate();
  function whereToNavigate(path: string) {
    if (window.location.pathname == path) return;
    scrollToTop();
    navigate(path);
  }

  return (
    <div data-menuOptionBar className={styles.menuBar}>
      <div onClick={() => whereToNavigate("/")} className={styles.menuItem}>
        <Home size={22} />
        <span>Home</span>
      </div>
      <div onClick={() => whereToNavigate("/search")} className={styles.menuItem}>
        <Search size={22} />
        <span>Search</span>
      </div>
      <div onClick={() => whereToNavigate("/my-list")} className={styles.menuItem}>
        <Heart size={22} />
        <span>Wishlist</span>
      </div>
      <div onClick={() => whereToNavigate("/orders")} className={styles.menuItem}>
        <ShoppingBag size={22} />
        <span>Orders</span>
      </div>
      <div onClick={() => whereToNavigate("/my-account")} className={styles.menuItem}>
        <User size={22} />
        <span>Account</span>
      </div>
    </div>
  );
}


export { MenuOptionBar }