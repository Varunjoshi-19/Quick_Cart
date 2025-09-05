import React, { useEffect, useRef } from "react";
import styles from "./accountcard.module.css";
import { User, ShoppingBag, Heart, LogOut } from "lucide-react";
import { useAuthStore, useCartStore } from "@/context";
import { useNavigate } from "react-router-dom";
import userLogo from "@/assets/default.jpg"
import { useGlobalContext } from "@/context/Context";

type AccountCardProps = {
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
};

const AccountCard: React.FC<AccountCardProps> = ({ onClose }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const { userData, removeUser } = useAuthStore();
    const { setProducts } = useGlobalContext();
    const { clearCart } = useCartStore();
    const navigate = useNavigate();


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (cardRef.current && event.target && !cardRef.current.contains(event.target as Node)) {
                onClose(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);


    function logoutActions() {
        removeUser();
        clearCart();
        setProducts(prev => {
            const updated = new Map(prev);
            for (const [key, value] of updated) {
                if (value.quantity > 0) {
                    updated.set(key, { ...value, quantity: 0 });
                }
            }
            return updated;
        });



    }

    return (
        <div ref={cardRef} className={styles.card}>
            <div className={styles.header}>
                <img src={userData?.imageData?.url || userLogo} alt="" className={styles.avatar} />
                <div>
                    <div className={styles.name}>{userData?.name}</div>
                    <div className={styles.email}>{userData?.email}</div>
                </div>
            </div>
            <div onClick={() => navigate("/my-account")} className={styles.item}>
                <User size={18} />
                <span>My Account</span>
            </div>
            <div onClick={() => navigate("/orders")} className={styles.item}>
                <ShoppingBag size={18} />
                <span>Orders</span>
            </div>
            <div onClick={() => navigate("/my-list")} className={styles.item}>
                <Heart size={18} />
                <span>My List</span>
            </div>
            <div onClick={logoutActions} className={styles.item}>
                <LogOut size={18} />
                <span>Logout</span>
            </div>
        </div>
    );
};

export default AccountCard;
