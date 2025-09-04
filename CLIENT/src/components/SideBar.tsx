import { useState } from "react";
import styles from "@/styles/sidebar.module.css";
import { ChevronDown, X } from "lucide-react";
import { useAuthStore } from "@/context";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
    setOpenSideBar: React.Dispatch<React.SetStateAction<boolean>>;
    setLocationApiBox: React.Dispatch<React.SetStateAction<boolean>>;
    sidebarOpen: boolean;
    selectedCountry: string;
}


interface Category {
    name: string;
    icon: string;
    subItems?: string[];
}

const categories: Category[] = [
    { name: "Fashion", icon: "👗", subItems: ["Men", "Women", "Kids"] },
    { name: "Electronics", icon: "📱", subItems: ["Mobiles", "Laptops", "Accessories"] },
    { name: "Bags", icon: "👜", subItems: ["Handbags", "Backpacks", "Suitcases"] },
    { name: "Footwear", icon: "👟", subItems: ["Men Shoes", "Women Shoes", "Kids Shoes"] },
    { name: "Groceries", icon: "🛒", subItems: ["Vegetables", "Fruits", "Snacks"] },
    { name: "Beauty", icon: "💄", subItems: ["Makeup", "Skincare", "Haircare"] },
    { name: "Wellness", icon: "🧘", subItems: ["Supplements", "Yoga", "Fitness"] },
];

export default function SideBar({ selectedCountry, sidebarOpen, setOpenSideBar, setLocationApiBox }: SidebarProps) {

    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const { userData, removeUser } = useAuthStore();
    const navigate = useNavigate();

    const toggleCategory = (name: string) => {
        setOpenCategory(openCategory === name ? null : name);
    };


    return (
        <>
            <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
                <div className={styles.header}>
                    <h2>Quick-Cart</h2>
                    <X className={styles.closeBtn} onClick={() => {
                        document.body.style.overflowY = "auto";
                        document.body.style.overflowX = "hidden";
                        setOpenSideBar(false);
                        const element = document.querySelector("[data-menuOptionBar]") as HTMLDivElement;
                        if (element) element.style.display = "flex";
                    }} size={24} />
                </div>

                <div onClick={() => setLocationApiBox(true)} className={styles.location}>
                    <input type="text" readOnly value={selectedCountry === "---" ? "Your location" : selectedCountry}
                        style={{ cursor: "pointer" }} />
                </div>

                <div className={styles.categories}>
                    {categories.map((cat) => (
                        <div key={cat.name} className={styles.category}>
                            <div
                                className={styles.categoryHeader}
                                onClick={() => toggleCategory(cat.name)}
                            >
                                <span className={styles.icon}>{cat.icon}</span>
                                <span className={styles.name}>{cat.name.toUpperCase()}</span>
                                {cat.subItems && (
                                    <ChevronDown
                                        className={`${styles.chevron} ${openCategory === cat.name ? styles.rotate : ""
                                            }`}
                                        size={18}
                                    />
                                )}
                            </div>
                            {openCategory === cat.name && cat.subItems && (
                                <ul className={styles.subItems}>
                                    {cat.subItems.map((sub) => (
                                        <li key={sub}>{sub}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                    {
                        userData ?
                            <button onClick={() => {
                                removeUser();
                                document.body.style.overflowY = "auto";
                                navigate("/signin");

                            }} className={styles.logoutBtn}>Logout</button>
                            :
                            <button onClick={() => {
                                navigate("/signin");
                                document.body.style.overflowY = "auto";
                            }} className={styles.signInBtn}>Sign In</button>

                    }
                </div>

            </div>
        </>
    );
}
