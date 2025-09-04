import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "../config/firebase";

export const GoogleAuthentication = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (!result.user || result.user == undefined) {
        return { data: null, success: false };
    }

    const token = await result.user.getIdToken();
    const userData = {
        photoUrl: result.user.photoURL,
        name: result.user.displayName,
        email: result.user.email,
        token: token
    }


    return {
        data: userData,
        success: true
    }
}
