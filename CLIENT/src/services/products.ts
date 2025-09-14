import { config } from "@/config";


export async function fetchProducts() {
    const res = await fetch(`${config.BACKEND_URL}/products/get-products`);
    const result = await res.json();
    return result;
}

// Search products by query (name or description)
export async function searchProducts(query: string) {
    const products = await fetchProducts();
    if (!query) return products;
    const lowerQuery = query.toLowerCase();
    return products.filter((product: any) =>
        product.name?.toLowerCase().includes(lowerQuery) ||
        product.description?.toLowerCase().includes(lowerQuery)
    );
}


export async function fetchOrders(userId: string) {

    try {
        const res = await fetch(`${config.BACKEND_URL}/api/orders/${userId}`);
        const result = await res.json();
 
        return result;

    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}


