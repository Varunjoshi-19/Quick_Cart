import React, { useEffect, useState } from 'react';
import styles from '../styles/signup.module.css';
import webAppLogo from "../assets/myWebLogo.png";
import { useNavigate } from 'react-router-dom';
import { UserSignUpSchema } from '../schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod";
import { config } from '@/config';
import { useNotify } from "@/modules/Prompts/notify";
import CenterLoader from "@/modules/Loaders/CenterLoader";


type UserSignUp = z.infer<typeof UserSignUpSchema>;



const Signup: React.FC = () => {


  const navigate = useNavigate();


  const [nameFloat, setNameFloat] = useState(false);
  const [emailFloat, setEmailFloat] = useState(false);
  const [passwordFloat, setPasswordFloat] = useState(false);

  const [signUpError, setSignUpError] = useState<string | null>(null);
  const notify = useNotify();
  const [busy, setBusy] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<UserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    mode: "onBlur"
  });

  const name = watch("name", "");
  const email = watch("email", "");
  const password = watch("password", "");


  useEffect(() => {
    if (!signUpError) return;

    const timeoutId = setTimeout(() => {
      setSignUpError(null);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [signUpError]);


  const handleSignUp = async (data: UserSignUp) => {
    try {
      setBusy(true);
      const response = await fetch(`${config.BACKEND_URL}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          provider: "email"
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = result?.errorMessage || result?.message || "Failed to sign up";
        setSignUpError(message);
        return;
      }

      notify("Signed up successfully. Please sign in", "success");
      setTimeout(() => navigate("/signin"), 800);
    }
    catch (error: any) {
      setSignUpError(error?.message || "Something went wrong while signing up.");
    } finally {
      setBusy(false);
    }
  }


  return (
    <div className={styles.bg}>
      <CenterLoader show={busy} message="Creating your account..." />
      <div className={styles.container}>
        <img src={webAppLogo} alt="Shopify" className={styles.logo} />
        <h2 className={styles.title}>Sign Up</h2>

        <form onSubmit={handleSubmit(handleSignUp)} >
          <div className={styles.row}>

            <div className={styles.inputGroup}>
              <label
                className={`${styles.label} ${(nameFloat || name) ? styles.labelFloat : ''}`}
                htmlFor="name"
              >Name</label>
              <input
                {...register("name")}
                id="name"
                type="text"
                className={styles.input}
                onFocus={() => setNameFloat(true)}
                onBlur={() => setNameFloat(!!name)}
                required
              />
              {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
            </div>

          </div>
          <div className={styles.inputGroup}>
            <label
              className={`${styles.label} ${(emailFloat || email) ? styles.labelFloat : ''}`}
              htmlFor="email"
            >Email</label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className={styles.input}
              onFocus={() => setEmailFloat(true)}
              onBlur={() => setEmailFloat(!!email)}
              required
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label
              className={`${styles.label} ${(passwordFloat || password) ? styles.labelFloat : ''}`}
              htmlFor="password"
            >Password</label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className={styles.input}
              onFocus={() => setPasswordFloat(true)}
              onBlur={() => setPasswordFloat(!!password)}
              required
            />
            {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
          </div>
          <div className={styles.forgotWrap}>
            <a href="#" className={styles.forgot}>Forgot Password?</a>
          </div>
          <div className={styles.btnWrap}>
            <button type="submit" className={styles.signUpBtn}>Sign Up</button>
            <button type="button" onClick={() => navigate("/")} className={styles.cancelBtn}>Cancel</button>
          </div>
        </form>
        <div className={styles.signinWrap}>
          Already Registered? <a href="/signin" className={styles.signin}>Sign In</a>
        </div>

      </div>
    </div>
  );
};

export default Signup;
