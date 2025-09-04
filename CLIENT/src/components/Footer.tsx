import styles from "@/styles/footer.module.css";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import joinLink from "@/assets/joinLink.png";
function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.newsletter}>
                <div className={styles.newsletterContent}>
                    <h4>$20 discount for your first order</h4>
                    <h2>Join our newsletter and get...</h2>
                    <p>
                        Join our email subscription now to get updates on promotions and
                        coupons.
                    </p>
                    <div className={styles.inputWrapper}>
                        <input type="email" placeholder="Your Email Address" />
                        <button>Subscribe</button>
                    </div>
                </div>
                <div className={styles.newsletterImage}>
                    <img
                        src={joinLink}
                        
                        alt="Newsletter illustration"
                    />
                </div>
            </div>

            {/* Features Section */}
            <div className={styles.features}>
                <div>🛒 Everyday fresh products</div>
                <div>🚚 Free delivery for order over $70</div>
                <div>🔥 Daily Mega Discounts</div>
                <div>💲 Best price on the market</div>
            </div>

            {/* Links Section */}
            <div className={styles.links}>
                {["FRUIT & VEGETABLES", "BREAKFAST & DAIRY", "MEAT & SEAFOOD", "BEVERAGES", "BREADS & BAKERY"].map(
                    (category) => (
                        <div key={category}>
                            <h4>{category}</h4>
                            <ul>
                                <li>Fresh Vegetables</li>
                                <li>Herbs & Seasonings</li>
                                <li>Fresh Fruits</li>
                                <li>Cuts & Sprouts</li>
                                <li>Exotic Fruits & Veggies</li>
                                <li>Packaged Produce</li>
                                <li>Party Trays</li>
                            </ul>
                        </div>
                    )
                )}
            </div>

            {/* Bottom Section */}
            <div className={styles.bottom}>
                <p>Copyright 2024. All rights reserved</p>
                <div className={styles.socials}>
                    <FaFacebookF />
                    <FaTwitter />
                    <FaInstagram />
                </div>
            </div>
        </footer>
    );
}

export default Footer;
