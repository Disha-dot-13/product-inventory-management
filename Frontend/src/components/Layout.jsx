import {
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Layout.css";

function Layout() {

    const {
        user,
        logout
    } = useAuth();

    const navigate = useNavigate();


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        logout();

        navigate("/login", {
            replace: true
        });
    };


    // =========================
    // NAVIGATION CLASS
    // =========================

    const getNavClass = ({ isActive }) => {

        return isActive
            ? "nav-link active"
            : "nav-link";
    };


    return (

        <div className="layout">


            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="sidebar">

                <div className="sidebar-logo">

                    <div className="logo-icon">
                        📦
                    </div>

                    <h2>
                        Inventory
                    </h2>

                </div>


                <nav className="sidebar-nav">

                    <NavLink
                        to="/dashboard"
                        className={getNavClass}
                    >
                        <span>
                            📊
                        </span>

                        Dashboard
                    </NavLink>


                    <NavLink
                        to="/products"
                        className={getNavClass}
                    >
                        <span>
                            📦
                        </span>

                        Products
                    </NavLink>


                    <NavLink
                        to="/inventory"
                        className={getNavClass}
                    >
                        <span>
                            📋
                        </span>

                        Inventory
                    </NavLink>


                    <NavLink
                        to="/categories"
                        className={getNavClass}
                    >
                        <span>
                            🗂️
                        </span>

                        Categories
                    </NavLink>


                    <NavLink
                        to="/suppliers"
                        className={getNavClass}
                    >
                        <span>
                            🚚
                        </span>

                        Suppliers
                    </NavLink>

                </nav>

            </aside>


            {/* =========================
                MAIN AREA
            ========================= */}

            <div className="main-area">


                {/* =========================
                    HEADER
                ========================= */}

                <header className="header">

                    <div>

                        <h2>
                            Product Inventory Management
                        </h2>

                    </div>


                    <div className="user-section">

                        <div className="user-info">

                            <span className="user-name">
                                {user?.name ||
                                    user?.email ||
                                    "User"}
                            </span>

                            <span className="role">
                                {user?.role}
                            </span>

                        </div>


                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </header>


                {/* =========================
                    PAGE CONTENT
                ========================= */}

                <main className="content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default Layout;