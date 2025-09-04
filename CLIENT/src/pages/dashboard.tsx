import Slider from "@/modules/Slider";
import { useAuthStore } from "../context"
import styles from "@/styles/dashboard.module.css";
import FeaturedCategory from "@/modules/FeaturedCategory";
import MidProductBar from "@/components/Product-Container/MidProductBar";
import HorizontalProduct from "@/modules/Products/HorizontalProduct";
import { OfferSlider } from "@/modules/Sliders/OfferSlider"
import { OFFERS, OFFERS2 } from "@/scripts/helper";
function DashBoard() {

    const { userData } = useAuthStore();
    console.log("this is the user data", userData);
    return (
        <main className={styles.dashBoardContainer}>

            <div style={{
                marginTop: "20px",
                width: "98%"
            }}>
                <Slider />
            </div>

            <FeaturedCategory />
            <MidProductBar />
            <OfferSlider offers={OFFERS} />
            <div style={{ width: "90%", marginTop: "30px" }}>
                <HorizontalProduct categoryItem="FEATURED PRODUCTS" />
            </div>

            <OfferSlider offers={OFFERS2} />


        </main>
    )
}

export default DashBoard
