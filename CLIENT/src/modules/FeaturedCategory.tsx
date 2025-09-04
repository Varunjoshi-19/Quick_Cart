import { Images } from "@/scripts/helper";
import styles from "@/styles/featuredCategory.module.css";

function FeaturedCategory() {
    return (

        <div className={styles.categoryContainer}>
            <span id={styles.tag} >FEATURED CATEGORIES</span>
            <div className={styles.innerContainer}>

                {

                    Images.map(each => (
                        <div className={styles.eachCategory}>
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