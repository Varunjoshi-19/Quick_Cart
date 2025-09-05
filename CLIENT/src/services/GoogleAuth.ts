import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "../config/firebase";
import { config } from '@/config';

export const GoogleAuthentication = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (!result.user || result.user == undefined) {
        return { data: null, success: false };
    }

    const token = await result.user.getIdToken();

    const userData = {
        imageData: {
            url: result.user.photoURL,
        },
        providerId: result.providerId,
        provider: "google",
        name: result.user.displayName,
        email: result.user.email,
        token: token
    }


    return {
        data: userData,
        success: true
    }
}

export const SaveGoogleCredentails = async (data: any) => {

    try {

        const res = await fetch(`${config.BACKEND_URL}/user/google-login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();    

        if (res.ok) {
            return {
                data : result.user,
                success: true,
                message: "Logged in successfully!"
            }
        }

        return {
            data : null,
            success: false,
            message: "failed to login!"
        }


    } catch (error: any) {
        return {
            data : null,    
            success: false,
            message: error.message
        }

    }


}