import { config } from "@/config";


export async function fetchProducts() {

    const res = await fetch(`${config.BACKEND_URL}/products/get-products`);
    const result = await res.json();
    console.log(result);
    return result;



}


export async function fetchOrders(userId: string) {

    try {
        const res = await fetch(`${config.BACKEND_URL}/api/orders/${userId}`);
        const result = await res.json();
        console.log("orders", result);
        return result;

    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}


