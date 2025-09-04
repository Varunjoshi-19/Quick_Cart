import { SingleProductMiddle } from "@/components/Products-Items/SingleProduct/index";
import { useParams } from "react-router-dom";
import Overlay from "@/modules/Loaders/Overlay";
import { useState } from "react";
import { useGlobalContext } from "@/context/Context";

function SingleProduct() {
    const { id } = useParams<{ id: string }>();
    const { products, performCartAction } = useGlobalContext();
    const [busy] = useState(false);

    if (!id || !products) return null;
    const product = products.get(id);
    if (!product) return null;

    return (
        <div>
            <Overlay show={busy} message="Updating your cart..." />
            <SingleProductMiddle
                title={product.name}
                brand={product.brand}
                rating={product.rating || 0}
                reviews={product.reviews || 0}
                oldPrice={product.actualPrice}
                newPrice={product.discountedPrice}
                discount={`${product.discount || 0}%`}
                stockStatus={product.inStock ? "IN STOCK" : "OUT OF STOCK"}
                imageSrc={product.productImage}
                description={product.description}
                quantity={product.quantity || 0}
                onAdd={() => performCartAction(product, "add")}
                onInc={() => performCartAction(product, "inc")}
                onDec={() => performCartAction(product, "dec")}
            />
        </div>
    )
}

export default SingleProduct