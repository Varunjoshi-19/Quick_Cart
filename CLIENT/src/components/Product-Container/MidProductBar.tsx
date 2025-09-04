import NewProducts from '@/modules/Products/NewProducts'
import HorizontalProduct from '@/modules/Products/HorizontalProduct'
import styles from "@/styles/midproduct.module.css";
import laptopSale from "@/assets/laptopSale.jpg";
import grocerySale from "@/assets/grocerySale.jpg";
function MidProductBar() {
    return (


        <div className={styles.midProductContainer}>


            <div className={styles.centererContainer}>

                <div className={styles.offersTop} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                    <img src={laptopSale} alt="" id={styles.saleOffer} />
                    <img src={grocerySale} alt="" id={styles.saleOffer} />


                </div>


                {/* left one  */}
                <div className={styles.leftProductContainer}>

                    <HorizontalProduct categoryItem='POPULAR PRODUCTS' />
                    <NewProducts />


                </div>


            </div>

        </div>
    )
}

export default MidProductBar