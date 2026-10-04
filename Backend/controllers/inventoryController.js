const Product = require("../models/Product");
const InventoryTransaction = require("../models/InventoryTransaction");

// =====================================================
// CREATE INVENTORY TRANSACTION
// =====================================================

const createTransaction = async (req, res) => {
    try {
        const { productId, type, quantity, reason } = req.body;

        // 1. Check required fields
        if (!productId || !type || !quantity) {
            return res.status(400).json({
                message: "Product, type and quantity are required"
            });
        }

        // 2. Check transaction type
        if (!["IN", "OUT"].includes(type)) {
            return res.status(400).json({
                message: "Transaction type must be IN or OUT"
            });
        }

        // 3. Check quantity
        if (quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        // 4. Find product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // 5. Prevent negative stock
        if (type === "OUT" && product.quantity < quantity) {
            return res.status(400).json({
                message: "Insufficient stock"
            });
        }

        // 6. Update stock
        if (type === "IN") {
            product.quantity += quantity;
        } else {
            product.quantity -= quantity;
        }

        await product.save();

        // 7. Create transaction history
        const transaction = await InventoryTransaction.create({
            product: productId,
            type,
            quantity,
            reason
        });

        // 8. Send response
        res.status(201).json({
            message: "Inventory updated successfully",
            product,
            transaction
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to update inventory",
            error: error.message
        });
    }
};


// =====================================================
// GET ALL INVENTORY TRANSACTIONS
// =====================================================

const getTransactions = async (req, res) => {
    try {
        const transactions = await InventoryTransaction
            .find()
            .populate("product", "name sku")
            .sort({ createdAt: -1 });

        res.status(200).json(transactions);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch transactions",
            error: error.message
        });
    }
};


// =====================================================
// GET TRANSACTIONS FOR SPECIFIC PRODUCT
// =====================================================

const getProductTransactions = async (req, res) => {
    try {
        const transactions = await InventoryTransaction
            .find({ product: req.params.productId })
            .populate("product", "name sku")
            .sort({ createdAt: -1 });

        res.status(200).json(transactions);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product transactions",
            error: error.message
        });
    }
};


// =====================================================
// GET INVENTORY SUMMARY
// =====================================================

const getInventorySummary = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();

        const stockResult = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalStock: { $sum: "$quantity" },
                    totalInventoryValue: {
                        $sum: {
                            $multiply: ["$price", "$quantity"]
                        }
                    }
                }
            }
        ]);

        const lowStockProducts = await Product.countDocuments({
            $expr: {
                $lte: ["$quantity", "$minimumStock"]
            }
        });

        const totalStock =
            stockResult.length > 0
                ? stockResult[0].totalStock
                : 0;

        const totalInventoryValue =
            stockResult.length > 0
                ? stockResult[0].totalInventoryValue
                : 0;

        res.status(200).json({
            totalProducts,
            totalStock,
            totalInventoryValue,
            lowStockProducts
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch inventory summary",
            error: error.message
        });
    }
};


// =====================================================
// 🧠 SMART REORDER RECOMMENDATIONS
// =====================================================

const getSmartReorderRecommendations = async (req, res) => {
    try {
        // -------------------------------------------------
        // Analyse the last 30 days
        // -------------------------------------------------

        const today = new Date();

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        // -------------------------------------------------
        // Get all products
        // -------------------------------------------------

        const products = await Product.find()
            .select("name sku quantity minimumStock price")
            .lean();

        // -------------------------------------------------
        // Get OUT transactions from last 30 days
        // -------------------------------------------------

        const transactions = await InventoryTransaction.find({
            type: "OUT",
            createdAt: {
                $gte: thirtyDaysAgo,
                $lte: today
            }
        }).lean();

        // -------------------------------------------------
        // Calculate demand for every product
        // -------------------------------------------------

        const demandMap = {};

        transactions.forEach((transaction) => {
            const productId = transaction.product.toString();

            if (!demandMap[productId]) {
                demandMap[productId] = 0;
            }

            demandMap[productId] += Number(transaction.quantity || 0);
        });

        // -------------------------------------------------
        // Generate recommendations
        // -------------------------------------------------

        const recommendations = products.map((product) => {
            const productId = product._id.toString();

            const totalOut =
                demandMap[productId] || 0;

            // Average daily demand over 30 days
            const averageDailyDemand =
                totalOut / 30;

            // Expected demand for next 7 days
            const expectedSevenDayDemand =
                averageDailyDemand * 7;

            // Keep minimum stock as safety stock
            const safetyStock =
                Number(product.minimumStock || 0);

            // Target stock
            const targetStock =
                Math.ceil(
                    safetyStock +
                    expectedSevenDayDemand
                );

            // Recommended order quantity
            const recommendedOrder =
                Math.max(
                    targetStock -
                    Number(product.quantity || 0),
                    0
                );

            // Determine status
            let status = "HEALTHY";

            if (recommendedOrder > 0) {
                status = "REORDER";
            }

            if (
                Number(product.quantity || 0) <=
                Number(product.minimumStock || 0)
            ) {
                status = "URGENT";
            }

            return {
                productId: product._id,
                name: product.name,
                sku: product.sku,

                currentStock:
                    Number(product.quantity || 0),

                minimumStock:
                    Number(product.minimumStock || 0),

                totalOutLast30Days:
                    totalOut,

                averageDailyDemand:
                    Number(
                        averageDailyDemand.toFixed(2)
                    ),

                expectedSevenDayDemand:
                    Number(
                        expectedSevenDayDemand.toFixed(2)
                    ),

                safetyStock,

                targetStock,

                recommendedOrder,

                status
            };
        });

        // -------------------------------------------------
        // Show products that actually need attention first
        // -------------------------------------------------

        recommendations.sort((a, b) => {
            const priority = {
                URGENT: 1,
                REORDER: 2,
                HEALTHY: 3
            };

            return priority[a.status] -
                priority[b.status];
        });

        // -------------------------------------------------
        // Summary
        // -------------------------------------------------

        const urgentProducts =
            recommendations.filter(
                (product) =>
                    product.status === "URGENT"
            );

        const reorderProducts =
            recommendations.filter(
                (product) =>
                    product.status === "REORDER"
            );

        res.status(200).json({
            analysisPeriodDays: 30,
            forecastPeriodDays: 7,

            totalProducts:
                recommendations.length,

            productsNeedingReorder:
                reorderProducts.length +
                urgentProducts.length,

            urgentProducts:
                urgentProducts.length,

            recommendations
        });

    } catch (error) {
        console.error(
            "Smart reorder error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to generate smart reorder recommendations",
            error: error.message
        });
    }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    createTransaction,
    getTransactions,
    getProductTransactions,
    getInventorySummary,
    getSmartReorderRecommendations
};