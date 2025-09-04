import { SingleProductMiddle } from "@/components/Products-Items/SingleProduct/index";
import dummyImage from "@/assets/shoes1.jpg";

function SingleProduct() {
    return (
        <div>
            <SingleProductMiddle
                title="TP-Link 2K 3MP Outdoor Pan/Tilt Security Wi-Fi Camera , IP65 Weatherproof, Motion Detection, 360 Degree Visual Coverage , Full Color Night-Vision , Cloud & Local Storage , Works With Alexa & Google Home"
                brand="TP-Link"
                rating={4}
                reviews={1}
                oldPrice={3599}
                newPrice={2599}
                discount="12%"
                stockStatus="IN STOCK"
                imageSrc={dummyImage}
            />
        </div>
    )
}

export default SingleProduct