import { EmptyList, ItemCart } from "@/components/Cart/index";
import { useCartStore } from "@/context";
function Cart() {

    const { cartItems } = useCartStore();

    const listName = "YOUR CART";
    const listDesc = "Your Cart is Currently Emtpy";

    return (
        <div style={{
            marginTop: "50px",
            width: "90%", display: "flex",
            flexDirection: "column",
            justifyItems: "center", alignItems: 'center'
        }}>

            <div style={{ width: "100%" }}>
                <h2 style={{ fontSize: "1.2rem" }} >{listName}</h2>
                <span>
                    <span>There are </span>
                    <span style={{ color: "red", fontWeight: "bolder" }}>{cartItems == null ? "0" : cartItems?.size}</span>
                    <span> products in your cart</span>
                </span>
            </div>

            {
                cartItems?.size == 0 || !cartItems ?
                    <EmptyList name={"CART"} listDesc={listDesc} listName={listName} />
                    :
                    <ItemCart />
            }

        </div>
    )
}

export default Cart