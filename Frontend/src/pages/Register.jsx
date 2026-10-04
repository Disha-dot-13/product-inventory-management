import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import AuthBrandPanel from "../components/AuthBrandPanel";

import "./Register.css";


function BoxLogo() {
    return (
        <svg
            className="register-box-logo"
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


function Register() {
    const navigate = useNavigate();

    const googleButtonRef = useRef(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [error, setError] = useState("");


    // =========================================
    // GOOGLE REGISTRATION / LOGIN
    // =========================================

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

            const { token, user } = result.data;

            // Store application JWT
            localStorage.setItem("token", token);

            // Store user information
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // Go to dashboard
            navigate("/dashboard", {
                replace: true
            });

        } catch (error) {
            console.error(
                "Google registration error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Google registration failed. Please try again."
            );
        } finally {
            setGoogleLoading(false);
        }
    };


    // =========================================
    // INITIALIZE GOOGLE
    // =========================================

    useEffect(() => {
        const initializeGoogle = () => {
            if (
                !window.google ||
                !googleButtonRef.current
            ) {
                return;
            }

            const clientId =
                import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
                    width: 400
                }
            );
        };


        // Google script already loaded
        if (window.google) {
            initializeGoogle();
            return;
        }


        // Load Google Identity Services
        const script = document.createElement("script");

        script.src =
            "https://accounts.google.com/gsi/client";

        script.async = true;
        script.defer = true;

        script.onload = initializeGoogle;

        document.head.appendChild(script);


        return () => {
            if (
                document.head.contains(script)
            ) {
                document.head.removeChild(script);
            }
        };

    }, []);


    // =========================================
    // NORMAL REGISTRATION
    // =========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();


        if (!trimmedName) {
            setError(
                "Please enter your full name."
            );
            return;
        }


        if (trimmedName.length < 2) {
            setError(
                "Name must contain at least 2 characters."
            );
            return;
        }


        if (!trimmedEmail) {
            setError(
                "Please enter your email address."
            );
            return;
        }


        if (!password) {
            setError(
                "Please enter a password."
            );
            return;
        }


        if (password.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }


        if (!confirmPassword) {
            setError(
                "Please confirm your password."
            );
            return;
        }


        if (password !== confirmPassword) {
            setError(
                "Passwords do not match."
            );
            return;
        }


        try {
            setLoading(true);

            await api.post(
                "/auth/register",
                {
                    name: trimmedName,
                    email: trimmedEmail,
                    password
                }
            );


            navigate("/login", {
                replace: true,
                state: {
                    message:
                        "Account created successfully. Please sign in."
                }
            });

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="register-page">

            {/* ==================================
                LEFT BRAND PANEL
            ================================== */}

            <AuthBrandPanel />


            {/* ==================================
                RIGHT REGISTER PANEL
            ================================== */}

            <section className="register-right">

                {/* TOP RIGHT */}

                <div className="register-top-action">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Sign In
                    </Link>

                </div>


                {/* REGISTER CONTENT */}

                <div className="register-right-content">

                    <div className="register-card">

                        {/* CARD BRAND */}

                        <div className="register-card-brand">

                            <div className="register-card-logo">
                                <BoxLogo />
                            </div>

                            <div className="register-card-brand-name">

                                <strong>
                                    Product Inventory
                                </strong>

                                <strong>
                                    Management System
                                </strong>

                            </div>

                        </div>


                        {/* HEADING */}

                        <div className="register-heading">

                            <span>
                                GET STARTED
                            </span>

                            <h1>
                                Create an Account
                            </h1>

                            <p>
                                Create your account to get started
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (
                            <div className="register-error">
                                {error}
                            </div>
                        )}


                        {/* FORM */}

                        <form onSubmit={handleSubmit}>

                            {/* FULL NAME */}

                            <div className="register-field">

                                <label>
                                    Full Name
                                </label>

                                <div className="register-input">

                                    <span className="register-input-icon">

                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                        >

                                            <circle
                                                cx="12"
                                                cy="8"
                                                r="3.5"
                                                strokeWidth="1.8"
                                            />

                                            <path
                                                d="M5 20C5.7 16.7 8.2 14.8 12 14.8C15.8 14.8 18.3 16.7 19 20"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                            />

                                        </svg>

                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        autoComplete="name"
                                        required
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="register-field">

                                <label>
                                    Email Address
                                </label>

                                <div className="register-input">

                                    <span className="register-input-icon">

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
                                            setEmail(e.target.value)
                                        }
                                        autoComplete="email"
                                        required
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="register-field">

                                <label>
                                    Password
                                </label>

                                <div className="register-input">

                                    <span className="register-input-icon">

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
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        autoComplete="new-password"
                                        required
                                    />

                                </div>

                                <small>
                                    Use at least 6 characters.
                                </small>

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div className="register-field">

                                <label>
                                    Confirm Password
                                </label>

                                <div className="register-input">

                                    <span className="register-input-icon">

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

                                            <path
                                                d="M9.5 15L11.2 16.7L14.8 13.2"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                        </svg>

                                    </span>

                                    <input
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="new-password"
                                        required
                                    />

                                </div>

                            </div>


                            {/* CREATE ACCOUNT */}

                            <button
                                type="submit"
                                className="register-button"
                                disabled={
                                    loading ||
                                    googleLoading
                                }
                            >

                                <span>
                                    {loading
                                        ? "Creating Account..."
                                        : "Create Account"
                                    }
                                </span>

                                {!loading && (
                                    <span className="register-arrow">
                                        →
                                    </span>
                                )}

                            </button>

                        </form>


                        {/* OR */}

                        <div className="register-divider">

                            <span></span>

                            <p>
                                OR
                            </p>

                            <span></span>

                        </div>


                        {/* REAL GOOGLE BUTTON */}

                        <div
                            className="register-google-button"
                            ref={googleButtonRef}
                        >

                            {googleLoading && (
                                <div className="register-google-loading">
                                    Signing in with Google...
                                </div>
                            )}

                        </div>


                        {/* LOGIN */}

                        <div className="login-prompt">

                            <span>
                                Already have an account?
                            </span>

                            <Link to="/login">
                                Login
                            </Link>

                        </div>

                    </div>

                </div>


                {/* FOOTER */}

                <footer className="register-footer">

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

export default Register;