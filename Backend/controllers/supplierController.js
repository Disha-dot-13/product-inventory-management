const Supplier = require("../models/Supplier");

// CREATE SUPPLIER
const createSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        // Check required fields
        if (!name || !email || !phone || !address) {
            return res.status(400).json({
                message: "Name, email, phone and address are required"
            });
        }

        // Check if supplier already exists
        const existingSupplier = await Supplier.findOne({ email });

        if (existingSupplier) {
            return res.status(400).json({
                message: "Supplier with this email already exists"
            });
        }

        // Create supplier
        const supplier = await Supplier.create({
            name,
            email,
            phone,
            address
        });

        res.status(201).json({
            message: "Supplier created successfully",
            supplier
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create supplier",
            error: error.message
        });
    }
};


// GET ALL SUPPLIERS
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort({ name: 1 });

        res.status(200).json(suppliers);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch suppliers",
            error: error.message
        });
    }
};


// GET SINGLE SUPPLIER
const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        res.status(200).json(supplier);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch supplier",
            error: error.message
        });
    }
};


// UPDATE SUPPLIER
const updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        res.status(200).json({
            message: "Supplier updated successfully",
            supplier
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to update supplier",
            error: error.message
        });
    }
};


// DELETE SUPPLIER
const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(
            req.params.id
        );

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        res.status(200).json({
            message: "Supplier deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete supplier",
            error: error.message
        });
    }
};


// EXPORT FUNCTIONS
module.exports = {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
};