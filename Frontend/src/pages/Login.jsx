import { useEffect, useRef, useState } from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import AuthBrandPanel from "../components/AuthBrandPanel";

import "./Login.css";


function BoxLogo() {
    return (
        <svg
            className="login-box-logo"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M32 5L54 17V43L32 56L10 43V17L32 5Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
            />

            <path
                d="M10 17L32 30L54 17"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
            />

            <path
                d="M32 30V56"
                stroke="currentColor"
                strokeWidth="3"
            />

            <path
                d="M21 11L43 24"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.6"
            />
        </svg>
    );
}


function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();

    const googleButtonRef = useRef(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [error, setError] = useState(
        location.state?.message || ""
    );


    /* =========================================
       GOOGLE LOGIN
    ========================================= */

    const handleGoogleResponse = async (response) => {

        try {

            setError("");
            setGoogleLoading(true);

            const result = await api.post(
                "/auth/google",
                {
                    credential: response.credential
                }
            );

            const {
                token,
                user
            } = result.data;

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );

        } catch (error) {

            console.error(
                "Google login error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Google login failed. Please try again."
            );

        } finally {

            setGoogleLoading(false);

        }
    };


    /* =========================================
       INITIALIZE GOOGLE
    ========================================= */

    useEffect(() => {

        const initializeGoogle = () => {

            if (
                !window.google ||
                !googleButtonRef.current
            ) {
                return;
            }

            const clientId =
                import.meta.env
                    .VITE_GOOGLE_CLIENT_ID;

            if (!clientId) {

                console.warn(
                    "VITE_GOOGLE_CLIENT_ID is missing."
                );

                return;
            }

            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: handleGoogleResponse
            });

            googleButtonRef.current.innerHTML = "";

            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    text: "continue_with",
                    shape: "rectangular",
                    width: 500
                }
            );
        };


        if (window.google) {

            initializeGoogle();

            return;
        }


        const script =
            document.createElement("script");

        script.src =
            "https://accounts.google.com/gsi/client";

        script.async = true;
        script.defer = true;

        script.onload =
            initializeGoogle;

        document.head.appendChild(
            script
        );


        return () => {

            if (
                document.head.contains(
                    script
                )
            ) {

                document.head.removeChild(
                    script
                );

            }

        };

    }, []);


    /* =========================================
       NORMAL LOGIN
    ========================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (
            !email.trim() ||
            !password
        ) {

            setError(
                "Please enter your email and password."
            );

            return;
        }

        try {

            setLoading(true);

            await login(
                email.trim(),
                password
            );

            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-page">

            {/* ==================================
                LEFT BRAND PANEL
            ================================== */}

            <AuthBrandPanel />


            {/* ==================================
                RIGHT LOGIN PANEL
            ================================== */}

            <section className="login-right">

                {/* ==================================
                    TOP RIGHT
                ================================== */}

                <div className="login-top-action">

                    <span>
                        New here?
                    </span>

                    <Link to="/register">
                        Create Account
                    </Link>

                </div>


                {/* ==================================
                    LOGIN CONTENT
                ================================== */}

                <div className="login-right-content">

                    <div className="login-card">


                        {/* ==================================
                            CARD BRAND
                        ================================== */}

                        <div className="login-card-brand">

                            <div className="login-card-logo">
                                <BoxLogo />
                            </div>

                            <div className="login-card-brand-name">

                                <strong>
                                    Product Inventory
                                </strong>

                                <strong>
                                    Management System
                                </strong>

                            </div>

                        </div>


                        {/* ==================================
                            HEADING
                        ================================== */}

                        <div className="login-heading">

                            <span>
                                WELCOME BACK
                            </span>

                            <h1>
                                Welcome Back!
                            </h1>

                            <p>
                                Login to continue to your dashboard
                            </p>

                        </div>


                        {/* ==================================
                            ERROR
                        ================================== */}

                        {error && (

                            <div className="login-error">
                                {error}
                            </div>

                        )}


                        {/* ==================================
                            FORM
                        ================================== */}

                        <form
                            onSubmit={handleSubmit}
                        >


                            {/* EMAIL */}

                            <div className="login-field">

                                <label>
                                    Email Address
                                </label>

                                <div className="login-input">

                                    <span className="login-input-icon">

                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                        >

                                            <rect
                                                x="3"
                                                y="5"
                                                width="18"
                                                height="14"
                                                rx="2"
                                                strokeWidth="1.8"
                                            />

                                            <path
                                                d="M3 7L12 13L21 7"
                                                strokeWidth="1.8"
                                            />

                                        </svg>

                                    </span>

                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="email"
                                        required
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="login-field">

                                <label>
                                    Password
                                </label>

                                <div className="login-input">

                                    <span className="login-input-icon">

                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                        >

                                            <rect
                                                x="5"
                                                y="10"
                                                width="14"
                                                height="10"
                                                rx="2"
                                                strokeWidth="1.8"
                                            />

                                            <path
                                                d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
                                                strokeWidth="1.8"
                                            />

                                        </svg>

                                    </span>

                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="current-password"
                                        required
                                    />

                                    <span className="login-password-icon">
                                        ◉
                                    </span>

                                </div>

                            </div>


                            {/* OPTIONS */}

                            <div className="login-options">

                                <label className="remember-me">

                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(
                                                e.target.checked
                                            )
                                        }
                                    />

                                    <span>
                                        Remember me
                                    </span>

                                </label>


                                {/* FORGOT PASSWORD */}

                                <Link
                                    to="/forgot-password"
                                    className="forgot-password"
                                >
                                    Forgot password?
                                </Link>

                            </div>


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                className="login-button"
                                disabled={
                                    loading ||
                                    googleLoading
                                }
                            >

                                <span>

                                    {loading
                                        ? "Signing In..."
                                        : "Sign In"}

                                </span>

                                {!loading && (

                                    <span className="login-arrow">
                                        →
                                    </span>

                                )}

                            </button>

                        </form>


                        {/* ==================================
                            OR
                        ================================== */}

                        <div className="login-divider">

                            <span></span>

                            <p>
                                OR
                            </p>

                            <span></span>

                        </div>


                        {/* ==================================
                            GOOGLE LOGIN
                        ================================== */}

                        <div
                            className="google-login"
                            ref={googleButtonRef}
                        >

                            {googleLoading && (

                                <div className="google-loading">
                                    Signing in with Google...
                                </div>

                            )}

                        </div>


                        {/* ==================================
                            REGISTER
                        ================================== */}

                        <div className="register-prompt">

                            <span>
                                Don't have an account?
                            </span>

                            <Link to="/register">
                                Register
                            </Link>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    FOOTER
                ================================== */}

                <footer className="login-footer">

                    <span>
                        © 2026 Product Inventory Management System.
                        All rights reserved.
                    </span>

                    <div>

                        <span>
                            Privacy
                        </span>

                        <b>|</b>

                        <span>
                            Terms
                        </span>

                        <b>|</b>

                        <span>
                            Support
                        </span>

                    </div>

                </footer>

            </section>

        </div>

    );
}

export default Login;