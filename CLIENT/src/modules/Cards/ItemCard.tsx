import { useState, useRef, useEffect } from "react";
import styles from "./itemcard.module.css";
import { Images  , SubItems} from "@/scripts/helper";

interface ItemCardProps {
    setCategoryCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
    categoryCardOpen: boolean;
}


export default function ItemCard({ setCategoryCardOpen, categoryCardOpen }: ItemCardProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setCategoryCardOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className={styles.dropdownWrapper}>
            {categoryCardOpen && (
                <div className={styles.card}>
                    {Images.map((cat) => (
                        <div
                            key={cat.name}
                            className={styles.item}
                            onMouseEnter={() => setHoveredItem(cat.name)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <img src={cat.src} alt={cat.name} className={styles.img} />
                            <span>{cat.name}</span>

                            {hoveredItem === cat.name && SubItems[cat.name] && (
                                <div className={styles.subCard}>
                                    {SubItems[cat.name].map((sub) => (
                                        <div key={sub} className={styles.subItem}>
                                            {sub}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
