const express = require("express");

const router = express.Router();

// Controllers
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

// Middleware
const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");


// =====================================================
// GET ALL CATEGORIES
// ADMIN + STAFF
// =====================================================

router.get(
    "/",
    protect,
    authorizeRoles("ADMIN", "STAFF"),
    getCategories
);


// =====================================================
// CREATE CATEGORY
// ADMIN ONLY
// =====================================================

router.post(
    "/",
    protect,
    authorizeRoles("ADMIN"),
    createCategory
);


// =====================================================
// UPDATE CATEGORY
// ADMIN ONLY
// =====================================================

router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    updateCategory
);


// =====================================================
// DELETE CATEGORY
// ADMIN ONLY
// =====================================================

router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    deleteCategory
);


module.exports = router;