import React, { useState } from 'react';
import styles from '../styles/signin.module.css';
import webAppLogo from "../assets/myWebLogo.png";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSignInSchema, } from '../schema';
import { GoogleAuthentication, SaveGoogleCredentails } from '../services/GoogleAuth';
import { useAuthStore } from "../context/index";
import { config } from '@/config';
import { useNotify } from "@/modules/Prompts/notify";
import { syncCartFromServer } from "@/context";
import CenterLoader from "@/modules/Loaders/CenterLoader";

type UserSignIn = z.infer<typeof UserSignInSchema>;

const SignIn: React.FC = () => {

    const navigate = useNavigate();
    const { setUserData } = useAuthStore();



    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<UserSignIn>({
        resolver: zodResolver(UserSignInSchema),
        mode: "onBlur"
    })

    const emailValue = watch("email", "");
    const passValue = watch("password", "");
    const notify = useNotify();
    const [busy, setBusy] = useState(false);


    const handleSignIn = async (data: UserSignIn) => {
        try {
            setBusy(true);
            const response = await fetch(`${config.BACKEND_URL}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: data.email, password: data.password, provider: "email" })
            });

            const result = await response.json();

            if (!response.ok) {
                const message = result?.errorMessage || result?.message || "Login failed";
                alert(message);
                return;
            }

            const user = result?.user ?? null;
            if (!user) {
                alert("Invalid server response.");
                return;
            }

            setUserData(user);
            localStorage.setItem("user-data", JSON.stringify(user));
            const uid = (user as any)?.id as string | undefined;
            if (uid) {
                await syncCartFromServer(uid);
            }
            notify("Signed in successfully", "success");
            setTimeout(() => navigate("/"), 800);
        } catch (error: any) {
            alert(error?.message || "Something went wrong while logging in.");
        } finally {
            setBusy(false);
        }
    }

    const handleGoogleSignin = async () => {
        setBusy(true);
        const info = await GoogleAuthentication();
        const { data, success } = info;
        if (!success) return;

        const result = await SaveGoogleCredentails(data);
        if (!result.success) {
            setBusy(false);
            return;
        }

        const dataUser = result.data;
        localStorage.setItem("user-data", JSON.stringify(dataUser));

        setUserData(data);

        const gUid = (data as any)?.id as string | undefined;
        if (gUid) {
            await syncCartFromServer(gUid);
        }
        notify("Signed in with Google successfully", "success");
        setTimeout(() => navigate("/"), 800);
        setBusy(false);
    }




    return (
        <div className={styles.bg}>
            <CenterLoader show={busy} message="Signing you in..." />
            <div className={styles.container}>
                <img src={webAppLogo} alt="quick-cart" className={styles.logo} />
                <h2 className={styles.title}>Sign In</h2>

                <form onSubmit={handleSubmit(handleSignIn)} >
                    <div className={styles.inputGroup}>
                        <label
                            className={`${styles.label} ${(emailFocused || emailValue) ? styles.labelFloat : ''}`}
                            htmlFor="email"
                        >
                            Email *
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={styles.input}
                            {...register("email")}
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            required
                        />
                        {errors.email && <p style={{ color: "red" }} >{errors.email.message}</p>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label
                            className={`${styles.label} ${(passwordFocused || passValue) ? styles.labelFloat : ''}`}
                            htmlFor="password"
                        >
                            Password *
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={styles.input}
                            {...register("password")}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            required
                        />
                        {errors.password && <p style={{ color: "red" }} >{errors.password.message}</p>}
                    </div>
                    <div className={styles.forgotWrap}>
                        <a href="#" className={styles.forgot}>Forgot Password?</a>
                    </div>
                    <button type="submit" className={styles.signInBtn}>Sign In</button>
                    <button type="button" onClick={() => navigate("/")} className={styles.cancelBtn}>Cancel</button>
                </form>


                <div className={styles.signupWrap}>
                    Not Registered? <a href="/signup" className={styles.signup}>Sign Up</a>
                </div>
                <div className={styles.socialWrap}>
                    <span>Or continue with social account</span>
                    <button onClick={handleGoogleSignin} className={styles.googleBtn}>
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google logo"
                            className={styles.googleIcon}
                        />
                        Sign In With Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
