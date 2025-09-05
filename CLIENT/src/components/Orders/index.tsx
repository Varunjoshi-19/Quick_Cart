import { useEffect, useState } from "react";
import styles from "./order.module.css";
import { fetchOrders } from "@/services/products";
import { useAuthStore } from "@/context";
import Overlay from "@/modules/Loaders/Overlay";
import { useNavigate } from "react-router-dom";

interface Order {
    id: string;
    userId: string;
    orderId: string;
    paymentId: string;
    userName: string;
    productName: { [key: string]: string };
    totalAmount: number;
    status: string;
    address: any;
    createdAt: string;
}


function OrderComponent() {

    const [allOrders, setAllOrders] = useState<any[] | null>(null);
    const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { userData } = useAuthStore();

    useEffect(() => {

        window.scrollTo(0, 0);

        (async () => {
            if (!userData) return;
            setOrdersLoading(true);
            const orders = await fetchOrders(userData.id);
            setOrdersLoading(false);
            if (!orders) return setAllOrders(null);

            setAllOrders(orders);
        })();
    }, [userData]);

    const getFormattedDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    return (
        <div className={styles.orderContainer}>
            <h2 className={styles.title}>ORDERS</h2>
            {allOrders && allOrders.length > 0 ? (

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order Id</th>
                                <th>Payment Id</th>
                                <th>Products</th>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Address</th>
                                <th>Pincode</th>
                                <th>Total Amount</th>
                                <th>Email</th>
                                <th>User Id</th>
                                <th>Order Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allOrders && allOrders.length > 0 && allOrders.map((order: Order, idx) => (
                                <tr key={idx}>
                                    <td>{order.orderId}</td>
                                    <td>{order.paymentId}</td>
                                    <td className={styles.link}>{
                                        Object.entries(order.productName).map(([key, value]: any) => (
                                            <span onClick={() => navigate(`/product/${key}`)} key={key}>{value}, </span>
                                        ))
                                    }</td>
                                    <td>{order.userName}</td>
                                    <td>{order.address.phone}</td>
                                    <td>{order.address.address}</td>
                                    <td>{order.address.zip}</td>
                                    <td>₹{order.totalAmount}</td>
                                    <td>{userData?.email}</td>
                                    <td>{order.userId}</td>
                                    <td>
                                        <span
                                            className={`${styles.status} ${order.status === "completed"
                                                ? styles.completed
                                                : styles.pending
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{getFormattedDate(order.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
                :
                <div>
                    {
                        ordersLoading ?

                            <div>
                                <Overlay show={ordersLoading} message="orders fetching" />
                            </div>
                            :
                            <div >
                                no orders yet
                            </div>

                    }
                </div>

            }

        </div>
    );
}


export { OrderComponent }