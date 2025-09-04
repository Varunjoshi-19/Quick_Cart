import styles from "@/styles/navabar.module.css";
import { AlignJustify, ChevronDown, Search, UserCircle } from "lucide-react";
import webLogo from "@/assets/myWebLogo.png";
import cartIcon from "@/assets/cart.svg";
import { useAuthStore, useCartStore } from "@/context";
import { useNavigate } from "react-router-dom";
import { Images, SubItems } from "@/scripts/helper";
import { useEffect, useState } from "react";
import AccountCard from "@/modules/Profile-card/AccountCard";
import ItemCard from "@/modules/Cards/ItemCard";
import Location from "@/modules/Cards/Location";
import { scrollToTop } from "@/utils";
import SideBar from "./SideBar";

function NavBar() {
    const navigate = useNavigate();
    const { userData } = useAuthStore();
    const { cartItems } = useCartStore();

    const [profileCardOpen, setProfileCardOpen] = useState(false);
    const [categoryCardOpen, setCategoryCardOpen] = useState(false);
    const [hideSomeTopArea, setHideSomeArea] = useState(false);
    const [hoveredBottomItem, setHoveredBottomItem] = useState<string | null>(null);
    const [locationApiBox, setLocationApiBox] = useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] = useState<string>("---");
    const [sidebarOpen, setOpenSideBar] = useState<boolean>(false);


    useEffect(() => {
        function handleScroll() {
            setHideSomeArea(window.scrollY > 115);
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    function whereToNavigate(path: string) {
        if (window.location.pathname == path) return;
        navigate(path);
        scrollToTop();
    }


    return (

        <>
            {selectedCountry && <SideBar setOpenSideBar={setOpenSideBar} selectedCountry={selectedCountry}
                setLocationApiBox={setLocationApiBox}
                sidebarOpen={sidebarOpen} />}

            {locationApiBox && <Location setLocationApiBox={setLocationApiBox} setSelectedCountry={setSelectedCountry} />}

            <nav
                className={styles.NavContainer}
                id={hideSomeTopArea ? styles.hideSomeArea : undefined}
            >
                <div className={styles.topOne}>

                    <div onClick={() => {
                        setOpenSideBar(true);
                        document.body.style.overflow = "hidden";
                        const element = document.querySelector("[data-menuOptionBar]") as HTMLDivElement;
                        if (element) element.style.display = "none";
                    }} data-ripple className={styles.menuIcon}>
                        <AlignJustify

                            style={{ marginLeft: "2px" }}
                            size={20}
                            color="black"
                        />
                    </div>

                    <div onClick={() => whereToNavigate("/")} className={styles.logoContainer}>
                        <img src={webLogo} alt="Logo" width={70} />
                        <span>Quick Cart</span>
                    </div>

                    <div data-ripple onClick={() => setLocationApiBox(prev => !prev)} className={styles.locationContainer}>
                        <span
                            style={{ fontSize: "13px", color: "rgba(128, 128, 128, 0.721)" }}
                        >
                            Your Location
                        </span>
                        <span style={{ color: "blue", fontWeight: "bolder" }}>{selectedCountry}</span>
                    </div>

                    <div className={styles.inputContainer}>
                        <input type="text" placeholder="Search for products..." />
                        <Search size={20} cursor={"pointer"} color="blue" />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {userData ? (
                            <div style={{ position: "relative" }}>
                                <button disabled={profileCardOpen} onClick={() => setProfileCardOpen(prev => !prev)}>
                                    <UserCircle
                                        id={styles.userCircle}
                                        size={35}
                                        cursor={"pointer"}

                                    />

                                </button>

                                {profileCardOpen && (
                                    <AccountCard onClose={setProfileCardOpen} />
                                )}
                            </div>
                        ) : (
                            <div
                                onClick={() => whereToNavigate("/signin")}
                                className={styles.LoginIcon}
                            >
                                <span>Login</span>
                            </div>
                        )}

                        <div onClick={() => whereToNavigate("/cart")} style={{ position: "relative", width: "auto", height: "auto" }}>
                            <div data-ripple className={styles.cartIcon}>
                                <img src={cartIcon} alt="Cart" width={30} />
                            </div>
                            <span id={styles.itemCount}>{cartItems?.size == 0 || cartItems == null ? "0" : cartItems?.size}</span>
                        </div>
                    </div>
                </div>


                <div className={styles.bottomOne}>



                    <div onClick={() => setCategoryCardOpen(prev => !prev)} id={styles.categoryContainer} >

                        <div data-ripple className={styles.allCategory}>
                            <AlignJustify size={15} />
                            <span>All CATEGORIES</span>
                            <ChevronDown size={20} />
                        </div>

                        <div style={{ bottom: "-80px", width: "100px", height: "100px", position: "absolute" }}>
                            <ItemCard setCategoryCardOpen={setCategoryCardOpen}
                                categoryCardOpen={categoryCardOpen}
                            />
                        </div>

                    </div>

                    {Images.map((each, index) => (
                        <div onClick={() => whereToNavigate(`/products/category/${each.name}`)} key={index} style={{ position: "relative", display: "flex", height: "auto" }}>

                            <div
                                data-ripple
                                className={styles.eachItem}
                                onMouseEnter={() => setHoveredBottomItem(each.name)}
                                onMouseLeave={() => setHoveredBottomItem(null)}
                            >
                                <img
                                    id={styles.eachItemIcon}
                                    width={25}
                                    src={each.src}
                                    alt={each.name}
                                />
                                <span>{each.name}</span>


                            </div>

                            {hoveredBottomItem === each.name && SubItems[each.name] && (
                                <div className={styles.bottomSubCard}>
                                    {SubItems[each.name].map((sub) => (
                                        <div key={sub} className={styles.bottomSubItem}>
                                            {sub}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                </div>
                
            </nav>
        </>

    );
}

export default NavBar;
