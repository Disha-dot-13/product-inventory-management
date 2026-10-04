import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import AuthBrandPanel from "../components/AuthBrandPanel";
import api from "../services/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/forgot-password", {
                email: email.trim()
            });

            setMessage(
                response.data.message ||
                "If an account exists with this email, you will receive a password reset link."
            );

            setEmail("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page forgot-password-page">
            <AuthBrandPanel />

            <div className="auth-form-panel">
                <div className="forgot-password-container">

                    {/* Icon */}
                    <div className="forgot-password-icon">
                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 17V17.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />

                            <path
                                d="M8.2 10C8.2 7.9 9.9 6.2 12 6.2C14.1 6.2 15.8 7.9 15.8 10V11"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <rect
                                x="5"
                                y="10"
                                width="14"
                                height="10"
                                rx="2"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                        </svg>
                    </div>

                    {/* Label */}
                    <span className="forgot-password-label">
                        ACCOUNT RECOVERY
                    </span>

                    {/* Heading */}
                    <h1>Forgot Password?</h1>

                    <p className="forgot-password-description">
                        Enter the email address associated with your account
                        and we'll help you reset your password.
                    </p>

                    {/* Error */}
                    {error && (
                        <div className="forgot-password-error">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {message && (
                        <div className="forgot-password-success">
                            {message}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>

                        <div className="forgot-form-group">
                            <label htmlFor="forgot-email">
                                EMAIL ADDRESS
                            </label>

                            <input
                                id="forgot-email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="forgot-submit-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Sending..."
                                : "Send Reset Link"}
                        </button>

                    </form>

                    {/* Back to Login */}
                    <Link
                        to="/login"
                        className="back-to-login"
                    >
                        <span>←</span>
                        Back to Login
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;