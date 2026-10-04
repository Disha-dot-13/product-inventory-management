import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Inventory from "./pages/Inventory";

import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";


function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


function App() {
    return (
        <AuthProvider>

            <BrowserRouter>

                <Routes>

                    {/* ================= AUTHENTICATION ================= */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/reset-password/:token"
                        element={<ResetPassword />}
                    />


                    {/* ================= PROTECTED APPLICATION ================= */}

                    <Route
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/products"
                            element={<Products />}
                        />

                        <Route
                            path="/inventory"
                            element={<Inventory />}
                        />

                        <Route
                            path="/categories"
                            element={<Categories />}
                        />

                        <Route
                            path="/suppliers"
                            element={<Suppliers />}
                        />

                    </Route>


                    {/* ================= DEFAULT ROUTES ================= */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />

                </Routes>

            </BrowserRouter>

        </AuthProvider>
    );
}


export default App;