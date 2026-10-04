import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {

    const [summary, setSummary] = useState(null);
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // LOAD DASHBOARD
    // =========================

    useEffect(() => {
        loadDashboard();
    }, []);


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const results =
                await Promise.allSettled([

                    api.get("/inventory/summary"),

                    api.get("/products", {
                        params: {
                            page: 1
                        }
                    }),

                    api.get("/inventory/transactions")

                ]);


            // =========================
            // SUMMARY
            // =========================

            if (
                results[0].status ===
                "fulfilled"
            ) {

                setSummary(
                    results[0].value.data
                );

            }


            // =========================
            // PRODUCTS
            // =========================

            if (
                results[1].status ===
                "fulfilled"
            ) {

                const data =
                    results[1].value.data;

                setProducts(
                    data.products ||
                    data.data ||
                    (Array.isArray(data)
                        ? data
                        : [])
                );

            }


            // =========================
            // TRANSACTIONS
            // =========================

            if (
                results[2].status ===
                "fulfilled"
            ) {

                const data =
                    results[2].value.data;

                setTransactions(
                    Array.isArray(data)
                        ? data
                        : data.transactions ||
                          data.data ||
                          []
                );

            }

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load dashboard"
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // LOW STOCK PRODUCTS
    // =========================

    const lowStockProducts =
        products.filter(
            (product) =>
                Number(product.quantity) <=
                Number(product.minimumStock)
        );


    // =========================
    // CHART DATA
    // =========================

    const chartData = products
        .slice(0, 7)
        .map((product) => ({
            name:
                product.name?.length > 10
                    ? product.name.substring(
                          0,
                          10
                      ) + "..."
                    : product.name,

            stock:
                Number(product.quantity) || 0
        }));


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date)
            .toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short"
                }
            );
    };


    if (loading) {

        return (
            <div className="dashboard-loading">

                <div className="loading-spinner">
                </div>

                Loading dashboard...

            </div>
        );

    }


    if (error) {

        return (
            <div className="dashboard-error">

                <h2>
                    {error}
                </h2>

                <button
                    onClick={loadDashboard}
                >
                    Try Again
                </button>

            </div>
        );

    }


    return (

        <div className="dashboard">


            {/* =========================
                HEADER
            ========================= */}

            <div className="dashboard-header">

                <div>

                    <div className="welcome-label">
                        OVERVIEW
                    </div>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Monitor your inventory
                        performance and stock levels.
                    </p>

                </div>


                <button
                    className="dashboard-refresh"
                    onClick={loadDashboard}
                >
                    ↻ &nbsp; Refresh
                </button>

            </div>


            {/* =========================
                STAT CARDS
            ========================= */}

            <div className="stat-grid">


                {/* PRODUCTS */}

                <div className="stat-card">

                    <div className="stat-top">

                        <div className="stat-icon blue">
                            ▣
                        </div>

                        <span className="stat-label">
                            PRODUCTS
                        </span>

                    </div>

                    <div className="stat-value">

                        {summary?.totalProducts ??
                            products.length ??
                            0}

                    </div>

                    <div className="stat-description">
                        Total products
                    </div>

                </div>


                {/* STOCK */}

                <div className="stat-card">

                    <div className="stat-top">

                        <div className="stat-icon purple">
                            ⇅
                        </div>

                        <span className="stat-label">
                            STOCK UNITS
                        </span>

                    </div>

                    <div className="stat-value">

                        {summary?.totalStock ??
                            products.reduce(
                                (
                                    total,
                                    product
                                ) =>
                                    total +
                                    Number(
                                        product.quantity
                                    ),
                                0
                            )}

                    </div>

                    <div className="stat-description">
                        Units currently available
                    </div>

                </div>


                {/* VALUE */}

                <div className="stat-card">

                    <div className="stat-top">

                        <div className="stat-icon green">
                            ₹
                        </div>

                        <span className="stat-label">
                            INVENTORY VALUE
                        </span>

                    </div>

                    <div className="stat-value currency">

                        ₹
                        {Number(
                            summary?.totalInventoryValue ||
                            0
                        ).toLocaleString(
                            "en-IN"
                        )}

                    </div>

                    <div className="stat-description">
                        Current inventory worth
                    </div>

                </div>


                {/* LOW STOCK */}

                <div
                    className={
                        lowStockProducts.length > 0
                            ? "stat-card warning-card"
                            : "stat-card"
                    }
                >

                    <div className="stat-top">

                        <div className="stat-icon orange">
                            !
                        </div>

                        <span className="stat-label">
                            LOW STOCK
                        </span>

                    </div>

                    <div className="stat-value">

                        {summary?.lowStockProducts ??
                            lowStockProducts.length}

                    </div>

                    <div className="stat-description">
                        Products need attention
                    </div>

                </div>

            </div>


            {/* =========================
                MAIN GRID
            ========================= */}

            <div className="dashboard-grid">


                {/* =========================
                    STOCK CHART
                ========================= */}

                <div className="dashboard-panel chart-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Stock Overview
                            </h2>

                            <p>
                                Current stock by product
                            </p>

                        </div>

                        <span className="panel-badge">
                            LIVE
                        </span>

                    </div>


                    {chartData.length === 0 ? (

                        <div className="empty-chart">
                            No product data available.
                        </div>

                    ) : (

                        <div className="chart-container">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <AreaChart
                                    data={chartData}
                                >

                                    <defs>

                                        <linearGradient
                                            id="stockGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >

                                            <stop
                                                offset="5%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0.35}
                                            />

                                            <stop
                                                offset="95%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0}
                                            />

                                        </linearGradient>

                                    </defs>

                                    <CartesianGrid
                                        stroke="#1e293b"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="name"
                                        stroke="#64748b"
                                        tick={{
                                            fill: "#64748b",
                                            fontSize: 11
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        stroke="#64748b"
                                        tick={{
                                            fill: "#64748b",
                                            fontSize: 11
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            background:
                                                "#111827",
                                            border:
                                                "1px solid #263244",
                                            borderRadius:
                                                "8px",
                                            color:
                                                "#f8fafc"
                                        }}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="stock"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fill="url(#stockGradient)"
                                    />

                                </AreaChart>

                            </ResponsiveContainer>

                        </div>

                    )}

                </div>


                {/* =========================
                    LOW STOCK
                ========================= */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Low Stock
                            </h2>

                            <p>
                                Products requiring attention
                            </p>

                        </div>

                        <span className="warning-icon">
                            !
                        </span>

                    </div>


                    {lowStockProducts.length === 0 ? (

                        <div className="no-alerts">

                            <div className="success-icon">
                                ✓
                            </div>

                            <strong>
                                Everything looks good
                            </strong>

                            <p>
                                No products are
                                currently low on stock.
                            </p>

                        </div>

                    ) : (

                        <div className="low-stock-list">

                            {lowStockProducts
                                .slice(0, 5)
                                .map(
                                    (product) => (

                                        <div
                                            className="low-stock-item"
                                            key={
                                                product._id
                                            }
                                        >

                                            <div className="product-mini-icon">
                                                {product.name
                                                    ?.charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>

                                            <div className="low-stock-info">

                                                <strong>
                                                    {
                                                        product.name
                                                    }
                                                </strong>

                                                <span>
                                                    Stock:{" "}
                                                    {
                                                        product.quantity
                                                    }
                                                    {" / "}
                                                    Min:{" "}
                                                    {
                                                        product.minimumStock
                                                    }
                                                </span>

                                            </div>

                                            <span className="low-badge">
                                                LOW
                                            </span>

                                        </div>

                                    )
                                )}

                        </div>

                    )}

                </div>

            </div>


            {/* =========================
                TRANSACTIONS
            ========================= */}

            <div className="dashboard-panel transactions-panel">

                <div className="panel-header">

                    <div>

                        <h2>
                            Recent Activity
                        </h2>

                        <p>
                            Latest inventory movements
                        </p>

                    </div>

                    <span className="activity-count">
                        {transactions.length}
                    </span>

                </div>


                {transactions.length === 0 ? (

                    <div className="no-activity">
                        No inventory activity yet.
                    </div>

                ) : (

                    <div className="activity-list">

                        {transactions
                            .slice(0, 6)
                            .map(
                                (transaction) => (

                                    <div
                                        className="activity-item"
                                        key={
                                            transaction._id
                                        }
                                    >

                                        <div
                                            className={
                                                transaction.type ===
                                                "IN"
                                                    ? "activity-icon in"
                                                    : "activity-icon out"
                                            }
                                        >
                                            {transaction.type ===
                                            "IN"
                                                ? "↑"
                                                : "↓"}
                                        </div>


                                        <div className="activity-info">

                                            <strong>

                                                {
                                                    transaction
                                                        .productId
                                                        ?.name ||
                                                    transaction
                                                        .product
                                                        ?.name ||
                                                    "Product"
                                                }

                                            </strong>

                                            <span>
                                                Stock{" "}
                                                {
                                                    transaction.type
                                                }
                                            </span>

                                        </div>


                                        <div
                                            className={
                                                transaction.type ===
                                                "IN"
                                                    ? "activity-quantity positive"
                                                    : "activity-quantity negative"
                                            }
                                        >

                                            {transaction.type ===
                                            "IN"
                                                ? "+"
                                                : "-"}

                                            {
                                                transaction.quantity
                                            }

                                        </div>


                                        <div className="activity-date">

                                            {formatDate(
                                                transaction.createdAt
                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Dashboard;