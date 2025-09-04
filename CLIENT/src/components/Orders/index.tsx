import styles from "./order.module.css";

interface Order {
    orderId: string;
    paymentId: string;
    products: string;
    name: string;
    phone: string;
    address: string;
    pincode: string;
    total: number;
    email: string;
    userId: string;
    status: string;
    date: string;
}

const dummyOrders: Order[] = [
    {
        orderId: "68b6dd62ef1b4eb89b99b73c",
        paymentId: "pay_RCj6ouNLbYvcBE",
        products: "Click here to view",
        name: "John Doe",
        phone: "9876543210",
        address: "123 Street, City",
        pincode: "400001",
        total: 298,
        email: "john@example.com",
        userId: "68b5dd25ef1b4eb89b982197",
        status: "pending",
        date: "2025-09-02",
    },
    {
        orderId: "68b6dd62ef1b4eb89b99b74d",
        paymentId: "pay_RCj7pNLbYvcBE",
        products: "Click here to view",
        name: "Jane Smith",
        phone: "9876501234",
        address: "456 Avenue, City",
        pincode: "400002",
        total: 450,
        email: "jane@example.com",
        userId: "68b5dd25ef1b4eb89b982198",
        status: "completed",
        date: "2025-09-01",
    },
];

 function OrderComponent() {

    return (
        <div className={styles.orderContainer}>
            <h2 className={styles.title}>ORDERS</h2>
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
                        {dummyOrders.map((order, idx) => (
                            <tr key={idx}>
                                <td>{order.orderId}</td>
                                <td>{order.paymentId}</td>
                                <td className={styles.link}>{order.products}</td>
                                <td>{order.name}</td>
                                <td>{order.phone}</td>
                                <td>{order.address}</td>
                                <td>{order.pincode}</td>
                                <td>{order.total}</td>
                                <td>{order.email}</td>
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
                                <td>{order.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


export {OrderComponent}