const express = require("express");

const router = express.Router();

// Controllers
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

// Middleware
const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");


// =====================================================
// CREATE PRODUCT
// ADMIN ONLY
// =====================================================

router.post(
    "/",
    protect,
    authorizeRoles("ADMIN"),
    createProduct
);


// =====================================================
// GET ALL PRODUCTS
// ADMIN + STAFF
// =====================================================

router.get(
    "/",
    protect,
    authorizeRoles("ADMIN", "STAFF"),
    getProducts
);


// =====================================================
// GET SINGLE PRODUCT
// ADMIN + STAFF
// =====================================================

router.get(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "STAFF"),
    getProductById
);


// =====================================================
// UPDATE PRODUCT
// ADMIN ONLY
// =====================================================

router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    updateProduct
);


// =====================================================
// DELETE PRODUCT
// ADMIN ONLY
// =====================================================

router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    deleteProduct
);


module.exports = router;