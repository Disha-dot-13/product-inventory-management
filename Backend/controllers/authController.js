const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);


/* =========================
   EMAIL TRANSPORTER
========================= */

const emailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


/* =========================
   REGISTER
========================= */

const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "STAFF"
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};


/* =========================
   NORMAL LOGIN
========================= */

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};


/* =========================
   GOOGLE LOGIN
========================= */

const googleLogin = async (req, res) => {

    try {

        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required"
            });
        }

        const ticket =
            await googleClient.verifyIdToken({
                idToken: credential,
                audience:
                    process.env.GOOGLE_CLIENT_ID
            });

        const payload =
            ticket.getPayload();

        const googleId = payload.sub;
        const email = payload.email;
        const name = payload.name;

        if (!email) {
            return res.status(400).json({
                message:
                    "Google account email could not be retrieved"
            });
        }

        let user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {

            user = await User.create({
                name: name || "Google User",
                email: email.toLowerCase(),
                password: await bcrypt.hash(
                    `${googleId}-${Date.now()}`,
                    10
                ),
                role: "STAFF"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Google login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Google login error:",
            error
        );

        res.status(401).json({
            message:
                "Google authentication failed"
        });
    }
};


/* =========================
   FORGOT PASSWORD
========================= */

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email address is required"
            });
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        /*
         Do not reveal whether an email
         exists in the database.
        */

        if (!user) {
            return res.status(200).json({
                message:
                    "If an account exists with this email, a password reset link has been sent."
            });
        }


        /* Generate secure random token */

        const resetToken =
            crypto.randomBytes(32).toString("hex");


        /* Hash token before storing it */

        const hashedResetToken =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");


        /*
         Token expires after 15 minutes
        */

        user.resetPasswordToken =
            hashedResetToken;

        user.resetPasswordExpires =
            Date.now() + 15 * 60 * 1000;

        await user.save();


        /*
         Frontend URL
         */

        const frontendUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";

        const resetUrl =
            `${frontendUrl}/reset-password/${resetToken}`;


        /* =========================
           EMAIL CONTENT
        ========================= */

        const mailOptions = {

            from:
                `"Product Inventory Management System" <${process.env.EMAIL_USER}>`,

            to: user.email,

            subject:
                "Password Reset - Product Inventory Management System",

            html: `

                <div style="
                    margin:0;
                    padding:40px 20px;
                    background:#f4f8ff;
                    font-family:Arial,Helvetica,sans-serif;
                ">

                    <div style="
                        max-width:560px;
                        margin:0 auto;
                        background:#ffffff;
                        border-radius:12px;
                        overflow:hidden;
                        border:1px solid #e2e8f0;
                    ">

                        <div style="
                            padding:25px;
                            background:#172554;
                            color:#ffffff;
                        ">

                            <h2 style="
                                margin:0;
                                font-size:20px;
                            ">
                                Product Inventory
                            </h2>

                            <p style="
                                margin:5px 0 0;
                                color:#bfdbfe;
                                font-size:13px;
                            ">
                                Management System
                            </p>

                        </div>


                        <div style="
                            padding:30px;
                        ">

                            <h2 style="
                                margin-top:0;
                                color:#172033;
                            ">
                                Reset Your Password
                            </h2>

                            <p style="
                                color:#64748b;
                                font-size:14px;
                                line-height:1.6;
                            ">
                                Hello ${user.name},
                            </p>

                            <p style="
                                color:#64748b;
                                font-size:14px;
                                line-height:1.6;
                            ">
                                We received a request to reset
                                your password. Click the button
                                below to create a new password.
                            </p>

                            <div style="
                                margin:30px 0;
                                text-align:center;
                            ">

                                <a
                                    href="${resetUrl}"
                                    style="
                                        display:inline-block;
                                        padding:13px 24px;
                                        background:#2563eb;
                                        color:#ffffff;
                                        text-decoration:none;
                                        border-radius:7px;
                                        font-size:14px;
                                        font-weight:bold;
                                    "
                                >
                                    Reset Password
                                </a>

                            </div>

                            <p style="
                                color:#64748b;
                                font-size:12px;
                                line-height:1.6;
                            ">
                                This password reset link will
                                expire in 15 minutes.
                            </p>

                            <p style="
                                color:#94a3b8;
                                font-size:11px;
                                line-height:1.6;
                            ">
                                If you did not request a password
                                reset, you can safely ignore this
                                email.
                            </p>

                        </div>

                    </div>

                </div>

            `
        };


        await emailTransporter.sendMail(
            mailOptions
        );


        res.status(200).json({
            message:
                "If an account exists with this email, a password reset link has been sent."
        });

    } catch (error) {

        console.error(
            "Forgot password error:",
            error
        );

        res.status(500).json({
            message:
                "Unable to process password reset request."
        });
    }
};


/* =========================
   RESET PASSWORD
========================= */

const resetPassword = async (req, res) => {

    try {

        const { token } = req.params;
        const { password } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "Reset token is required"
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "New password is required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters"
            });
        }


        /* Hash token received from URL */

        const hashedResetToken =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");


        /*
         Find user with valid,
         non-expired token
        */

        const user = await User.findOne({
            resetPasswordToken:
                hashedResetToken,

            resetPasswordExpires: {
                $gt: Date.now()
            }
        });


        if (!user) {
            return res.status(400).json({
                message:
                    "Password reset link is invalid or has expired."
            });
        }


        /* Hash new password */

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        user.password =
            hashedPassword;


        /*
         Clear reset token after
         successful password reset
        */

        user.resetPasswordToken =
            undefined;

        user.resetPasswordExpires =
            undefined;

        await user.save();


        res.status(200).json({
            message:
                "Password reset successful. You can now login with your new password."
        });

    } catch (error) {

        console.error(
            "Reset password error:",
            error
        );

        res.status(500).json({
            message:
                "Unable to reset password."
        });
    }
};


module.exports = {

    registerUser,
    loginUser,
    googleLogin,
    forgotPassword,
    resetPassword

};