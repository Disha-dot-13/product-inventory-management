import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ResetPassword.css";
import AuthBrandPanel from "../components/AuthBrandPanel";
import api from "../services/api";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!password || !confirmPassword) {
            setError("Please fill in both password fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!token) {
            setError("Invalid or missing password reset link.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                `/auth/reset-password/${token}`,
                {
                    password
                }
            );

            setMessage(
                response.data.message ||
                "Password reset successful. You can now log in."
            );

            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to reset password. The link may have expired."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page reset-password-page">

            <AuthBrandPanel />

            <div className="auth-form-panel">

                <div className="reset-password-container">

                    {/* Icon */}
                    <div className="reset-password-icon">
                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M7 10V8C7 5.24 9.24 3 12 3C14.76 3 17 5.24 17 8V10"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <rect
                                x="5"
                                y="10"
                                width="14"
                                height="11"
                                rx="2"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M12 14V17"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {/* Label */}
                    <span className="reset-password-label">
                        ACCOUNT SECURITY
                    </span>

                    {/* Heading */}
                    <h1>Reset Password</h1>

                    <p className="reset-password-description">
                        Create a new password for your account.
                        Make sure it is at least 6 characters long.
                    </p>

                    {/* Error */}
                    {error && (
                        <div className="reset-password-error">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {message && (
                        <div className="reset-password-success">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* New Password */}
                        <div className="reset-form-group">

                            <label htmlFor="new-password">
                                NEW PASSWORD
                            </label>

                            <div className="password-input-wrapper">

                                <input
                                    id="new-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="new-password"
                                    disabled={loading}
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>

                        {/* Confirm Password */}
                        <div className="reset-form-group">

                            <label htmlFor="confirm-password">
                                CONFIRM PASSWORD
                            </label>

                            <div className="password-input-wrapper">

                                <input
                                    id="confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    autoComplete="new-password"
                                    disabled={loading}
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="reset-submit-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Resetting..."
                                : "Reset Password"}
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

export default ResetPassword;