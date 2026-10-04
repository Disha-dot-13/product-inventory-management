import "./AuthBrandPanel.css";

function BoxLogo() {
    return (
        <svg
            className="auth-box-logo"
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


function AuthBrandPanel() {

    return (

        <section className="auth-brand-panel">

            {/* =================================
                WAREHOUSE IMAGE
            ================================= */}

            <div className="auth-brand-image"></div>


            {/* =================================
                IMAGE OVERLAY
            ================================= */}

            <div className="auth-brand-overlay"></div>


            {/* =================================
                CONTENT
            ================================= */}

            <div className="auth-brand-content">

                {/* ==============================
                    TOP BRAND
                ============================== */}

                <div className="auth-brand-header">

                    <div className="auth-brand-icon">

                        <BoxLogo />

                    </div>


                    <div className="auth-brand-title">

                        <strong>
                            Product Inventory
                        </strong>

                        <strong>
                            Management System
                        </strong>

                    </div>


                    <div className="auth-brand-divider"></div>


                    <div className="auth-navigation">

                        <span>
                            Organize
                        </span>

                        <b>•</b>

                        <span>
                            Track
                        </span>

                        <b>•</b>

                        <span>
                            Manage
                        </span>

                        <b>•</b>

                        <span>
                            Grow
                        </span>

                    </div>

                </div>


                {/* ==============================
                    HERO TEXT
                ============================== */}

                <div className="auth-hero">

                    <div className="auth-hero-line"></div>

                    <h1>

                        Efficient
                        <br />

                        Inventory
                        <br />

                        <span>
                            Smarter Business
                        </span>

                    </h1>


                    <p>
                        All your products, inventory,
                        suppliers and reports in one place.
                    </p>

                </div>


                {/* ==============================
                    FEATURES
                ============================== */}

                <div className="auth-features">

                    {/* PRODUCT */}

                    <div className="auth-feature">

                        <div className="auth-feature-icon blue">
                            📦
                        </div>

                        <div className="auth-feature-text">

                            <h3>
                                Manage Products
                            </h3>

                            <p>
                                Add, update and organize
                                your products
                            </p>

                        </div>

                    </div>


                    {/* INVENTORY */}

                    <div className="auth-feature">

                        <div className="auth-feature-icon green">
                            📊
                        </div>

                        <div className="auth-feature-text">

                            <h3>
                                Track Inventory
                            </h3>

                            <p>
                                Monitor stock levels
                                in real-time
                            </p>

                        </div>

                    </div>


                    {/* SUPPLIERS */}

                    <div className="auth-feature">

                        <div className="auth-feature-icon purple">
                            👥
                        </div>

                        <div className="auth-feature-text">

                            <h3>
                                Manage Suppliers
                            </h3>

                            <p>
                                Keep supplier information
                                organized
                            </p>

                        </div>

                    </div>


                    {/* SECURITY */}

                    <div className="auth-feature">

                        <div className="auth-feature-icon yellow">
                            🛡
                        </div>

                        <div className="auth-feature-text">

                            <h3>
                                Secure & Role-Based Access
                            </h3>

                            <p>
                                Admin and staff access
                                with proper permissions
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==============================
                    QUOTE
                ============================== */}

                <div className="auth-quote">

                    <span>
                        "Organized Inventory
                    </span>

                    <span>
                        Builds a Better Tomorrow."
                    </span>

                    <div></div>

                </div>

            </div>

        </section>
    );
}

export default AuthBrandPanel;