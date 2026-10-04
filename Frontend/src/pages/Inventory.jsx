import React, { useEffect, useMemo, useState } from "react";
import "./Inventory.css";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Inventory = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    const [summary, setSummary] = useState({
        totalProducts: 0,
        totalStock: 0,
        totalInventoryValue: 0,
        lowStockProducts: 0,
    });

    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]);

    const [smartReorder, setSmartReorder] = useState({
        recommendations: [],
        productsNeedingReorder: 0,
        urgentProducts: 0,
    });

    const [smartReorderLoading, setSmartReorderLoading] = useState(false);

    const [showMovement, setShowMovement] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [movementFilter, setMovementFilter] = useState("ALL");

    const [formData, setFormData] = useState({
        productId: "",
        type: "IN",
        quantity: "",
        reason: "",
    });

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                summaryResponse,
                transactionsResponse,
                productsResponse,
                smartReorderResponse,
            ] = await Promise.all([
                api.get("/inventory/summary"),
                api.get("/inventory/transactions"),
                api.get("/products"),
                api.get("/inventory/smart-reorder"),
            ]);

            setSummary(
                summaryResponse.data || {
                    totalProducts: 0,
                    totalStock: 0,
                    totalInventoryValue: 0,
                    lowStockProducts: 0,
                }
            );

            setTransactions(transactionsResponse.data || []);

            const productData = productsResponse.data;

            if (Array.isArray(productData)) {
                setProducts(productData);
            } else if (Array.isArray(productData?.products)) {
                setProducts(productData.products);
            } else {
                setProducts([]);
            }

            setSmartReorder(
                smartReorderResponse.data || {
                    recommendations: [],
                    productsNeedingReorder: 0,
                    urgentProducts: 0,
                }
            );
        } catch (err) {
            console.error("Inventory loading error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to load inventory data."
            );
        } finally {
            setLoading(false);
            setSmartReorderLoading(false);
        }
    };

    const refreshSmartReorder = async () => {
        try {
            setSmartReorderLoading(true);

            const response = await api.get(
                "/inventory/smart-reorder"
            );

            setSmartReorder(
                response.data || {
                    recommendations: [],
                    productsNeedingReorder: 0,
                    urgentProducts: 0,
                }
            );
        } catch (err) {
            console.error("Smart reorder error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to refresh smart reorder recommendations."
            );
        } finally {
            setSmartReorderLoading(false);
        }
    };

    const handleMovementChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleMovementSubmit = async (e) => {
        e.preventDefault();

        if (!formData.productId) {
            setError("Please select a product.");
            return;
        }

        if (!formData.quantity || Number(formData.quantity) <= 0) {
            setError("Quantity must be greater than 0.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            await api.post("/inventory/transaction", {
                productId: formData.productId,
                type: formData.type,
                quantity: Number(formData.quantity),
                reason: formData.reason.trim(),
            });

            setFormData({
                productId: "",
                type: "IN",
                quantity: "",
                reason: "",
            });

            setShowMovement(false);

            await loadInventory();
        } catch (err) {
            console.error("Inventory movement error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to update inventory."
            );
        } finally {
            setSaving(false);
        }
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const productName =
                transaction.product?.name?.toLowerCase() || "";

            const productSku =
                transaction.product?.sku?.toLowerCase() || "";

            const transactionReason =
                transaction.reason?.toLowerCase() || "";

            const searchValue = search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                productName.includes(searchValue) ||
                productSku.includes(searchValue) ||
                transactionReason.includes(searchValue);

            const matchesMovement =
                movementFilter === "ALL" ||
                transaction.type === movementFilter;

            return matchesSearch && matchesMovement;
        });
    }, [transactions, search, movementFilter]);

    const smartRecommendations = useMemo(() => {
        return (
            smartReorder?.recommendations?.filter(
                (product) => product.status !== "HEALTHY"
            ) || []
        );
    }, [smartReorder]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value || 0);
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="inventory-page">
                <div className="inventory-loading">
                    <div className="inventory-loader"></div>
                    <p>Loading inventory...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="inventory-page">

            {/* ================= HEADER ================= */}

            <div className="inventory-header">
                <div>
                    <span className="inventory-label">
                        INVENTORY CONTROL
                    </span>

                    <h1>Inventory Management</h1>

                    <p>
                        Monitor stock levels, movements and intelligent
                        reorder recommendations.
                    </p>
                </div>

                {isAdmin && (
                    <button
                        className="movement-button"
                        onClick={() => {
                            setError("");
                            setShowMovement(true);
                        }}
                    >
                        <span>+</span>
                        Stock Movement
                    </button>
                )}
            </div>

            {/* ================= ERROR ================= */}

            {error && (
                <div className="inventory-error">
                    <span>!</span>
                    <p>{error}</p>

                    <button
                        onClick={() => setError("")}
                        type="button"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* ================= STATISTICS ================= */}

            <div className="inventory-stats">

                <div className="inventory-stat">
                    <div className="inventory-stat-icon blue">
                        P
                    </div>

                    <div className="inventory-stat-content">
                        <span>TOTAL PRODUCTS</span>
                        <strong>
                            {summary.totalProducts || 0}
                        </strong>
                        <small>Active products</small>
                    </div>
                </div>

                <div className="inventory-stat">
                    <div className="inventory-stat-icon green">
                        S
                    </div>

                    <div className="inventory-stat-content">
                        <span>TOTAL STOCK</span>
                        <strong>
                            {summary.totalStock || 0}
                        </strong>
                        <small>Units currently available</small>
                    </div>
                </div>

                <div className="inventory-stat">
                    <div className="inventory-stat-icon purple">
                        ₹
                    </div>

                    <div className="inventory-stat-content">
                        <span>INVENTORY VALUE</span>
                        <strong>
                            {formatCurrency(
                                summary.totalInventoryValue
                            )}
                        </strong>
                        <small>Current stock value</small>
                    </div>
                </div>

                <div className="inventory-stat">
                    <div className="inventory-stat-icon orange">
                        !
                    </div>

                    <div className="inventory-stat-content">
                        <span>LOW STOCK</span>
                        <strong>
                            {summary.lowStockProducts || 0}
                        </strong>
                        <small>Needs attention</small>
                    </div>
                </div>

            </div>

            {/* ================= SMART REORDER ================= */}

            <div className="smart-reorder-section">

                <div className="smart-reorder-header">

                    <div>
                        <span className="smart-reorder-label">
                            INTELLIGENT INVENTORY
                        </span>

                        <h2>Smart Reorder Intelligence</h2>

                        <p>
                            Recommendations based on the last 30 days
                            of stock movement.
                        </p>
                    </div>

                    <div className="smart-reorder-actions">

                        <div className="smart-reorder-summary">

                            <div className="smart-summary-item">
                                <span>NEED REORDER</span>

                                <strong>
                                    {smartReorder.productsNeedingReorder ||
                                        0}
                                </strong>
                            </div>

                            <div className="smart-summary-item urgent">
                                <span>URGENT</span>

                                <strong>
                                    {smartReorder.urgentProducts || 0}
                                </strong>
                            </div>

                        </div>

                        <button
                            className="smart-refresh-button"
                            onClick={refreshSmartReorder}
                            disabled={smartReorderLoading}
                        >
                            {smartReorderLoading
                                ? "Refreshing..."
                                : "Refresh"}
                        </button>

                    </div>
                </div>

                {smartRecommendations.length === 0 ? (

                    <div className="smart-reorder-empty">

                        <div className="smart-empty-icon">
                            ✓
                        </div>

                        <div>
                            <strong>
                                Inventory looks healthy
                            </strong>

                            <p>
                                No products currently require
                                reordering based on the current
                                demand analysis.
                            </p>
                        </div>

                    </div>

                ) : (

                    <div className="smart-reorder-grid">

                        {smartRecommendations.map((product) => (

                            <div
                                className={`smart-reorder-card ${product.status.toLowerCase()}`}
                                key={product.productId}
                            >

                                <div className="smart-card-top">

                                    <div>
                                        <span className="smart-card-sku">
                                            {product.sku || "NO SKU"}
                                        </span>

                                        <h3>
                                            {product.name}
                                        </h3>
                                    </div>

                                    <span
                                        className={`smart-status ${product.status.toLowerCase()}`}
                                    >
                                        {product.status}
                                    </span>

                                </div>

                                <div className="smart-stock-row">

                                    <div>
                                        <span>
                                            CURRENT STOCK
                                        </span>

                                        <strong>
                                            {product.currentStock}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            MINIMUM STOCK
                                        </span>

                                        <strong>
                                            {product.minimumStock}
                                        </strong>
                                    </div>

                                </div>

                                <div className="smart-demand">

                                    <div className="smart-demand-item">
                                        <span>
                                            DAILY DEMAND
                                        </span>

                                        <strong>
                                            {
                                                product.averageDailyDemand
                                            }{" "}
                                            units
                                        </strong>
                                    </div>

                                    <div className="smart-demand-item">
                                        <span>
                                            7-DAY FORECAST
                                        </span>

                                        <strong>
                                            {
                                                product.expectedSevenDayDemand
                                            }{" "}
                                            units
                                        </strong>
                                    </div>

                                </div>

                                <div className="smart-recommendation">

                                    <span>
                                        RECOMMENDED ORDER
                                    </span>

                                    <strong>
                                        {product.recommendedOrder}{" "}
                                        units
                                    </strong>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            {/* ================= TRANSACTION PANEL ================= */}

            <div className="inventory-panel">

                <div className="inventory-panel-header">

                    <div>
                        <span className="panel-label">
                            STOCK ACTIVITY
                        </span>

                        <h2>Transaction History</h2>

                        <p>
                            Complete record of inventory movements.
                        </p>
                    </div>

                    <div className="inventory-filters">

                        <div className="inventory-search">
                            <span>⌕</span>

                            <input
                                type="text"
                                placeholder="Search product, SKU..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />
                        </div>

                        <select
                            value={movementFilter}
                            onChange={(e) =>
                                setMovementFilter(e.target.value)
                            }
                        >
                            <option value="ALL">
                                All Movements
                            </option>

                            <option value="IN">
                                Stock In
                            </option>

                            <option value="OUT">
                                Stock Out
                            </option>
                        </select>

                    </div>

                </div>

                <div className="inventory-table-wrapper">

                    <table className="inventory-table">

                        <thead>
                            <tr>
                                <th>PRODUCT</th>
                                <th>TYPE</th>
                                <th>QUANTITY</th>
                                <th>REASON</th>
                                <th>DATE</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredTransactions.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="5"
                                        className="empty-table"
                                    >
                                        No inventory transactions found.
                                    </td>
                                </tr>

                            ) : (

                                filteredTransactions.map(
                                    (transaction) => (

                                        <tr
                                            key={
                                                transaction._id
                                            }
                                        >

                                            <td>
                                                <div className="inventory-product">

                                                    <div className="inventory-product-icon">
                                                        {transaction.product?.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase() ||
                                                            "P"}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {
                                                                transaction
                                                                    .product
                                                                    ?.name
                                                            }
                                                        </strong>

                                                        <small>
                                                            {
                                                                transaction
                                                                    .product
                                                                    ?.sku
                                                            }
                                                        </small>
                                                    </div>

                                                </div>
                                            </td>

                                            <td>

                                                <span
                                                    className={`movement-badge ${
                                                        transaction.type ===
                                                        "IN"
                                                            ? "in"
                                                            : "out"
                                                    }`}
                                                >
                                                    {transaction.type ===
                                                    "IN"
                                                        ? "STOCK IN"
                                                        : "STOCK OUT"}
                                                </span>

                                            </td>

                                            <td>

                                                <strong
                                                    className={
                                                        transaction.type ===
                                                        "IN"
                                                            ? "quantity-in"
                                                            : "quantity-out"
                                                    }
                                                >
                                                    {transaction.type ===
                                                    "IN"
                                                        ? "+"
                                                        : "-"}
                                                    {
                                                        transaction.quantity
                                                    }
                                                </strong>

                                            </td>

                                            <td>
                                                {
                                                    transaction.reason ||
                                                        "—"
                                                }
                                            </td>

                                            <td>
                                                {formatDate(
                                                    transaction.createdAt
                                                )}
                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

                <div className="inventory-table-footer">
                    Showing{" "}
                    <strong>
                        {filteredTransactions.length}
                    </strong>{" "}
                    transaction
                    {filteredTransactions.length !== 1
                        ? "s"
                        : ""}
                </div>

            </div>

            {/* ================= STOCK MOVEMENT MODAL ================= */}

            {showMovement && isAdmin && (

                <div
                    className="inventory-modal-overlay"
                    onMouseDown={(e) => {
                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            setShowMovement(false);
                        }
                    }}
                >

                    <div className="inventory-modal">

                        <div className="inventory-modal-header">

                            <div>
                                <span>
                                    INVENTORY ACTION
                                </span>

                                <h2>
                                    Record Stock Movement
                                </h2>

                                <p>
                                    Add or remove stock from
                                    inventory.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() =>
                                    setShowMovement(false)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleMovementSubmit
                            }
                        >

                            <div className="form-group">

                                <label>
                                    PRODUCT
                                </label>

                                <select
                                    name="productId"
                                    value={
                                        formData.productId
                                    }
                                    onChange={
                                        handleMovementChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select a product
                                    </option>

                                    {products.map(
                                        (product) => (
                                            <option
                                                key={
                                                    product._id
                                                }
                                                value={
                                                    product._id
                                                }
                                            >
                                                {
                                                    product.name
                                                }{" "}
                                                —{" "}
                                                {
                                                    product.sku
                                                }{" "}
                                                (Stock:{" "}
                                                {
                                                    product.quantity ??
                                                        0
                                                }
                                                )
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            <div className="movement-form-grid">

                                <div className="form-group">

                                    <label>
                                        MOVEMENT TYPE
                                    </label>

                                    <select
                                        name="type"
                                        value={
                                            formData.type
                                        }
                                        onChange={
                                            handleMovementChange
                                        }
                                    >

                                        <option value="IN">
                                            Stock In
                                        </option>

                                        <option value="OUT">
                                            Stock Out
                                        </option>

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        QUANTITY
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        value={
                                            formData.quantity
                                        }
                                        onChange={
                                            handleMovementChange
                                        }
                                        placeholder="Enter quantity"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="form-group">

                                <label>
                                    REASON
                                </label>

                                <input
                                    type="text"
                                    name="reason"
                                    value={
                                        formData.reason
                                    }
                                    onChange={
                                        handleMovementChange
                                    }
                                    placeholder="e.g. Purchase, Sale, Damaged..."
                                />

                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        setShowMovement(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Updating..."
                                        : "Update Inventory"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Inventory;