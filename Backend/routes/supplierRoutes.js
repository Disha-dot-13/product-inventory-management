const express = require("express");

const router = express.Router();

const {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} = require("../controllers/supplierController");

// Middleware
const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");


// Get all suppliers
// ADMIN + STAFF
router.get(
    "/",
    protect,
    authorizeRoles("ADMIN", "STAFF"),
    getSuppliers
);


// Create supplier
// ADMIN only
router.post(
    "/",
    protect,
    authorizeRoles("ADMIN"),
    createSupplier
);


// Get one supplier
// ADMIN + STAFF
router.get(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "STAFF"),
    getSupplierById
);


// Update supplier
// ADMIN only
router.put(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    updateSupplier
);


// Delete supplier
// ADMIN only
router.delete(
    "/:id",
    protect,
    authorizeRoles("ADMIN"),
    deleteSupplier
);


module.exports = router;