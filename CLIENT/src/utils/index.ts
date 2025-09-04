import { config } from "@/config";


export let ALL_COUNTRIES: any[] = [];




export function lookForUserData() {

    const userData = localStorage.getItem("user-data");
    if (userData) {
        const parsedData = JSON.parse(userData);
        return parsedData;
    }
    return null;
}

export async function fetchAllCountries() {

    try {

        const response = await fetch(import.meta.env.VITE_COUNTRY_API_URL);
        const result = await response.json();
        if (response.ok) {
            ALL_COUNTRIES = result.data;
            return result.data;
        }
        if (!response.ok) console.log(result);

    }
    catch (err) {
        console.log(err);
    }


}

export function searchForSpecificCountry(country: string) {

    if (!country || typeof country !== "string") return ALL_COUNTRIES;

    const escapedCountry = country.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedCountry, "i");

    const matchedCountries = ALL_COUNTRIES.filter(c => regex.test(c.country));
    console.log(matchedCountries);
    return matchedCountries;
}

export const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};


export const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};


export async function RazorPayPaymentVerification(data: any) {

    const { amount, currency } = data;

    const orderData = await fetch(`${config.BACKEND_URL}/api/order/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount, currency: currency }),
    })

    const result = await orderData.json();
    return result;



}


export function toggleDomOverflow(enable: boolean) {
    if (enable) {
        document.body.style.overflowY = "auto";
        document.body.style.overflowX = "hidden";
    } else {
        document.body.style.overflowY = "hidden";
        document.body.style.overflowX = "hidden";
    }
}
