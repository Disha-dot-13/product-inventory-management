const express = require("express");

const router = express.Router();

const {
    createTransaction,
    getInventorySummary,
    getTransactions,
    getProductTransactions,
    getSmartReorderRecommendations
} = require("../controllers/inventoryController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");


// =====================================================
// INVENTORY TRANSACTIONS
// =====================================================

// ADMIN ONLY
router.post(
    "/transaction",
    protect,
    authorizeRoles("ADMIN"),
    createTransaction
);


// =====================================================
// INVENTORY SUMMARY
// =====================================================

// ADMIN + STAFF
router.get(
    "/summary",
    protect,
    authorizeRoles("ADMIN", "STAFF"),
    getInventorySummary
);


// =====================================================
// TRANSACTION HISTORY
// =====================================================

// ADMIN + STAFF
router.get(
    "/transactions",
    protect,
    authorizeRoles("ADMIN", "STAFF"),
    getTransactions
);


// =====================================================
// PRODUCT TRANSACTION HISTORY
// =====================================================

// ADMIN + STAFF
router.get(
    "/transactions/:productId",
    protect,
    authorizeRoles("ADMIN", "STAFF"),
    getProductTransactions
);


// =====================================================
// 🧠 SMART REORDER RECOMMENDATIONS
// =====================================================

// ADMIN + STAFF can view recommendations
router.get(
    "/smart-reorder",
    protect,
    authorizeRoles("ADMIN", "STAFF"),
    getSmartReorderRecommendations
);


module.exports = router;