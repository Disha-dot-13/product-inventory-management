import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();

        navigate("/login", {
            replace: true
        });
    };

    const getNavClass = ({ isActive }) =>
        isActive
            ? "nav-link active"
            : "nav-link";

    return (
        <div className="layout">

            {/* SIDEBAR */}
            <aside className="sidebar">

                <div className="sidebar-logo">

                    <div className="logo-icon">
                        ◈
                    </div>

                    <div>
                        <h2>Invexa</h2>
                        <span>Inventory System</span>
                    </div>

                </div>


                <div className="nav-section">

                    <p className="nav-title">
                        MAIN MENU
                    </p>

                    <nav className="sidebar-nav">

                        <NavLink
                            to="/dashboard"
                            className={getNavClass}
                        >
                            <span className="nav-icon">
                                ◉
                            </span>

                            <span>
                                Dashboard
                            </span>
                        </NavLink>


                        <NavLink
                            to="/products"
                            className={getNavClass}
                        >
                            <span className="nav-icon">
                                ▣
                            </span>

                            <span>
                                Products
                            </span>
                        </NavLink>


                        <NavLink
                            to="/inventory"
                            className={getNavClass}
                        >
                            <span className="nav-icon">
                                ⇄
                            </span>

                            <span>
                                Inventory
                            </span>
                        </NavLink>

                    </nav>

                </div>


                <div className="nav-section">

                    <p className="nav-title">
                        MANAGEMENT
                    </p>

                    <nav className="sidebar-nav">

                        <NavLink
                            to="/categories"
                            className={getNavClass}
                        >
                            <span className="nav-icon">
                                ◫
                            </span>

                            <span>
                                Categories
                            </span>
                        </NavLink>


                        <NavLink
                            to="/suppliers"
                            className={getNavClass}
                        >
                            <span className="nav-icon">
                                ◇
                            </span>

                            <span>
                                Suppliers
                            </span>
                        </NavLink>

                    </nav>

                </div>


                {/* SIDEBAR BOTTOM */}

                <div className="sidebar-bottom">

                    <div className="system-status">

                        <span className="status-dot"></span>

                        <div>
                            <strong>
                                System Online
                            </strong>

                            <small>
                                All services operational
                            </small>
                        </div>

                    </div>

                </div>

            </aside>


            {/* MAIN AREA */}

            <div className="main-area">

                {/* HEADER */}

                <header className="header">

                    <div className="header-left">

                        <div className="breadcrumb">
                            Inventory
                        </div>

                    </div>


                    <div className="header-right">

                        <button
                            className="notification-button"
                            title="Notifications"
                        >
                            ♢

                            <span className="notification-dot">
                            </span>
                        </button>


                        <div className="header-divider">
                        </div>


                        <div className="user-section">

                            <div className="user-avatar">
                                {(user?.name ||
                                    user?.email ||
                                    "U")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="user-info">

                                <span className="user-name">
                                    {user?.name ||
                                        user?.email ||
                                        "User"}
                                </span>

                                <span className="user-role">
                                    {user?.role}
                                </span>

                            </div>

                        </div>


                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </header>


                {/* PAGE */}

                <main className="content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default Layout;