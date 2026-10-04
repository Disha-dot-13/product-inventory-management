const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// ================================
// MIDDLEWARE
// ================================

// Allow local React frontend and deployed Vercel frontend
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://product-inventory-management-two.vercel.app"
        ],
        credentials: true
    })
);

// Read JSON request bodies
app.use(express.json());

// ================================
// CONNECT TO MONGODB
// ================================

connectDB();

// ================================
// ROUTES
// ================================

const productRoutes = require("./routes/productRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");

app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);

// ================================
// HOME ROUTE
// ================================

app.get("/", (req, res) => {
    res.send("Product Inventory Management API is running");
});

// ================================
// 404 ROUTE
// ================================

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// ================================
// START SERVER
// ================================

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});