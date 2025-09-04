import { config } from "@/config";


export async function fetchProducts() {

    const res = await fetch(`${config.BACKEND_URL}/products/get-products`);
    const result = await res.json();
    console.log(result);
    return result;



}

