import { useEffect, useState } from "react";
import styles from "@/styles/checkout.module.css";
import { useCartStore } from "@/context";
import { useNavigate } from "react-router-dom";
import { loadRazorpayScript, RazorPayPaymentVerification } from "@/utils";
import { config } from "@/config";
import { useGlobalContext } from "@/context/Context";
import CenterLoader from "@/modules/Loaders/CenterLoader";

const Checkout = () => {

    const { cartItems, clearCart } = useCartStore();
    const [paymentVerifiedAndDone, setPaymentVerifiedAndDone] = useState<boolean>(false);
    const {  setNotify } = useGlobalContext();
    const [busy, setBusy] = useState(false);


    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        country: "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        email: "",
    });

    const itemsArray = cartItems ? Array.from(cartItems.values()) : [];

    const subtotal = itemsArray.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleSaveAddressAndProceed(e: React.FormEvent<HTMLFormElement>) {

        e.preventDefault();
        localStorage.setItem("delivery-address", JSON.stringify(formData));

        setBusy(true);
        const res = await loadRazorpayScript();

        if (!res) {
            alert("Razorpay SDK failed to load. Check your internet.");
            return;
        }

        const orderId = await RazorPayPaymentVerification({ amount: subtotal, currency: "INR" });

        console.log(subtotal);

        const options = {
            key: config.razorpayKey,
            amount: subtotal * 100,
            currency: "INR",
            order_id: orderId,
            name: formData.fullName,
            description: "Order Payment",
            handler: async function (response: any) {

                const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
                const productNames = itemsArray.map(item => item.name).join(", ");
                const orderDetailsData = {
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    userName: formData.fullName,
                    productName: productNames,
                    totalAmount: subtotal,
                    address: `${formData.address}, ${formData.apartment}, ${formData.city}, ${formData.state}, ${formData.zip}, ${formData.country}`,
                }

                if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                    console.log("payement id's missing");
                    return;
                }

                const res = await fetch(`${config.BACKEND_URL}/api/payment/verify`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ razorpay_payment_id, razorpay_order_id, razorpay_signature })
                });
                if (res.ok) {
                    console.log("payment verified done");
                    setPaymentVerifiedAndDone(true);
                    await handleSavePlacedOrder(orderDetailsData);
                    clearCart();
                    localStorage.removeItem("cart-storage");
                    return;
                }
                if (!res.ok) {
                    navigate("/cart");
                    setPaymentVerifiedAndDone(false);
                    return;
                }
            },


            prefill: {
                name: formData.fullName,
                email: formData.email,
                contact: formData.phone
            },
            theme: {
                color: "#3399cc"
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setBusy(false);

    }

    async function handleSavePlacedOrder(orderDetailsData: any) {
        try {
            const res = await fetch(`${config.BACKEND_URL}/api/order/place-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderDetailsData)
            });

            console.log("Order placement response status:", res.status);

            if (res.ok) {
                const result = await res.json();
                console.log("Order saved successfully:", result);
                return;
            } else {
                const errorData = await res.text();
                console.error("Order placement failed:", res.status, errorData);
            }
        } catch (error) {
            console.error("Error placing order:", error);
        }
    }


    useEffect(() => {
        if (!cartItems || cartItems.size == 0 || itemsArray.length == 0) {
            navigate("/");
            return;
        }
    }, []);

    useEffect(() => {

        (() => {
            if (paymentVerifiedAndDone) {
                setNotify({ message: "Order placed successfully", type: "success" });
                const timeoutId = setTimeout(() => {

                    setPaymentVerifiedAndDone(false);

                    navigate("/orders");
                    return () => clearTimeout(timeoutId);
                }, 3000);
            }
        })();

    }, [paymentVerifiedAndDone]);


    return (


        <>

            <div className={styles.checkoutContainer}>
                <CenterLoader show={busy} message="Processing payment..." />

                <form id="billing" className={styles.billingForm} onSubmit={handleSaveAddressAndProceed}>
                    <h3>Billing Details</h3>
                    <div className={styles.row}>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name *"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="country"
                            placeholder="Country *"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <input
                        type="text"
                        name="address"
                        placeholder="House number and street name *"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="apartment"
                        placeholder="Apartment, suite, unit, etc. (optional)"
                        value={formData.apartment}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="Town / City *"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="state"
                        placeholder="State / County *"
                        value={formData.state}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="zip"
                        placeholder="Postcode / ZIP *"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                    />
                    <div className={styles.row}>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </form>


                <div className={styles.orderSummary}>
                    <h3>Your Order</h3>
                    <div className={styles.summaryHeader}>
                        <span>Product</span>
                        <span>Subtotal</span>
                    </div>
                    {itemsArray.map((item) => (
                        <div key={item._id} className={styles.summaryRow}>
                            <span>
                                {item.name.length > 25 ? `${item.name.substring(0, 25)}...` : item.name} × {item.quantity}
                            </span>
                            <span>₹{(item.price * item.quantity).toLocaleString()}.00</span>
                        </div>
                    ))}
                    <div className={styles.summaryRow}>
                        <strong>Subtotal</strong>
                        <strong>₹{subtotal.toLocaleString()}.00</strong>
                    </div>
                    <button type="submit" form="billing" className={styles.checkoutBtn}>
                        Confirm Purchase
                    </button>
                </div>


            </div>

        </>
    );
};

export default Checkout;
