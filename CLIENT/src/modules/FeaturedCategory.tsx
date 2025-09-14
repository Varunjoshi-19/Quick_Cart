import { Images } from "@/scripts/helper";
import styles from "@/styles/featuredCategory.module.css";
import { useNavigate } from "react-router-dom";

function FeaturedCategory() {

    const navigate = useNavigate();
    return (

        <div className={styles.categoryContainer}>
            <span id={styles.tag} >FEATURED CATEGORIES</span>
            <div className={styles.innerContainer}>

                {

                    Images.map(each => (
                        <div  onClick={() => navigate(`/products/category/${each.name.toUpperCase()}`)} className={styles.eachCategory}>
                            <div id={styles.iconContainer} style={{ background: each.backgroundColor }}>
                                <img src={each.src} alt=""
                                    style={{ width: "100%", objectFit: "contain" }}
                                />
                            </div>
                            <span>{each.name}</span>
                        </div>
                    ))
                }

            </div>

        </div>
    )
}

export default FeaturedCategory