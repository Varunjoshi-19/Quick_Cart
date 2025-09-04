import React, { useEffect, useState } from 'react';
import styles from '../styles/signup.module.css';
import webAppLogo from "../assets/myWebLogo.png";
import { useNavigate } from 'react-router-dom';
import { GoogleAuthentication } from '../services/GoogleAuth';
import { useAuthStore } from '../context';
import z from "zod";
import { UserSignUpSchema } from '../schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveCredentailsInDatabase } from '../utils';


type UserSignUp = z.infer<typeof UserSignUpSchema>;



const Signup: React.FC = () => {


  const navigate = useNavigate();
  const { setUserData } = useAuthStore();




  const [nameFloat, setNameFloat] = useState(false);
  const [emailFloat, setEmailFloat] = useState(false);
  const [passwordFloat, setPasswordFloat] = useState(false);

  const [signUpError, setSignUpError] = useState<string | null>(null);

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
    const result = await saveCredentailsInDatabase(data);
    const { error, success } = result;
    if (!success) {
      setSignUpError(error);
      throw new Error(error);
    }

    navigate("/signin");
    return;
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

export default Signup;
