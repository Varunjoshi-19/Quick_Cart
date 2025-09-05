import { config } from "@/config";

export async function fetchUserCart(userId: string) {
    const res = await fetch(`${config.BACKEND_URL}/cart/${userId}`);
    return res.json();
}

export async function addToCart(payload: { userId: string; productId: string; quantity?: number; name: string; price: number; imageUrl?: string }) {
    const res = await fetch(`${config.BACKEND_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return res.json().then((data) => ({ ok: res.ok, data }));
}

export async function updateCartQuantity(payload: { userId: string; productId: string; quantity: number }) {
    const res = await fetch(`${config.BACKEND_URL}/cart/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return res.json().then((data) => ({ ok: res.ok, data }));
}

export async function removeFromCart(payload: { userId: string; productId: string }) {
    const res = await fetch(`${config.BACKEND_URL}/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return res.json().then((data) => ({ ok: res.ok, data }));
}

export async function clearServerCart(userId: string) {

    try {
        await fetch(`${config.BACKEND_URL}/cart/clear/${userId}`, {
            method: "POST",
        });

    }
    catch (error) {
        console.log(error);
    }


}
