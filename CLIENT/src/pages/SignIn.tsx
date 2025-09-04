import React, { useState } from 'react';
import styles from '../styles/signin.module.css';
import webAppLogo from "../assets/myWebLogo.png";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSignInSchema, } from '../schema';
import { GoogleAuthentication } from '../services/GoogleAuth';
import { useAuthStore } from "../context/index";

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


    const handleSignIn = async (data: UserSignIn) => {
        console.log("User data : ", data);

    }

    const handleGoogleSignin = async () => {
        const info = await GoogleAuthentication();
        const { data, success } = info;
        if (!success) return;

        setUserData(data);
        localStorage.setItem("user-data", JSON.stringify(data));
        navigate("/");

    }




    return (
        <div className={styles.bg}>
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
