const Product = require("../models/Product");
const mongoose = require("mongoose");
// Get all products
// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            supplier,
            lowStock,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        // Convert page and limit into numbers
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        // Validate page and limit
        if (
            !Number.isInteger(pageNumber) ||
            !Number.isInteger(limitNumber) ||
            pageNumber < 1 ||
            limitNumber < 1
        ) {
            return res.status(400).json({
                message: "Page and limit must be positive integers"
            });
        }

        // Maximum limit
        if (limitNumber > 100) {
            return res.status(400).json({
                message: "Limit cannot be greater than 100"
            });
        }

        // Create filter object
        const filter = {};

        // SEARCH
        // Search by product name OR SKU
        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    sku: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        // CATEGORY FILTER
        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({
                    message: "Invalid category ID"
                });
            }

            filter.category = category;
        }

        // SUPPLIER FILTER
        if (supplier) {
            if (!mongoose.Types.ObjectId.isValid(supplier)) {
                return res.status(400).json({
                    message: "Invalid supplier ID"
                });
            }

            filter.supplier = supplier;
        }

        // LOW STOCK FILTER
        if (lowStock === "true") {
            filter.$expr = {
                $lte: ["$quantity", "$minimumStock"]
            };
        }

        // SORTING
        let sortOption = {
            createdAt: -1
        };

        if (sort === "price") {
            sortOption = {
                price: 1
            };
        }

        if (sort === "-price") {
            sortOption = {
                price: -1
            };
        }

        if (sort === "name") {
            sortOption = {
                name: 1
            };
        }

        if (sort === "-name") {
            sortOption = {
                name: -1
            };
        }

        // PAGINATION
        const skip = (pageNumber - 1) * limitNumber;

        // Count total matching products
        const totalProducts = await Product.countDocuments(filter);

        // Get products
        const products = await Product
            .find(filter)
            .populate("category", "name")
            .populate("supplier", "name")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        // Calculate total pages
        const totalPages = Math.ceil(
            totalProducts / limitNumber
        );

        // Send response
        res.status(200).json({
            products,

            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalProducts,
                totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
};
// Create a product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            sku,
            description,
            price,
            quantity,
            category,
            supplier,
            minimumStock
        } = req.body;

        // Required fields
        if (
            !name ||
            !sku ||
            price === undefined ||
            quantity === undefined ||
            !category ||
            !supplier ||
            minimumStock === undefined
        ) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        // Check price
        if (price < 0) {
            return res.status(400).json({
                message: "Price cannot be negative"
            });
        }

        // Check quantity
        if (quantity < 0) {
            return res.status(400).json({
                message: "Quantity cannot be negative"
            });
        }

        // Check minimum stock
        if (minimumStock < 0) {
            return res.status(400).json({
                message: "Minimum stock cannot be negative"
            });
        }

        // Check duplicate SKU
        const existingProduct = await Product.findOne({ sku });

        if (existingProduct) {
            return res.status(400).json({
                message: "Product with this SKU already exists"
            });
        }

        // Check category ID
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({
                message: "Invalid category ID"
            });
        }

        // Check supplier ID
        if (!mongoose.Types.ObjectId.isValid(supplier)) {
            return res.status(400).json({
                message: "Invalid supplier ID"
            });
        }

        const product = await Product.create({
            name,
            sku,
            description,
            price,
            quantity,
            category,
            supplier,
            minimumStock
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
};
// GET PRODUCT BY ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product
            .findById(id)
            .populate("category", "name")
            .populate("supplier", "name");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        // rest of your code...
        const {
            name,
            sku,
            description,
            price,
            quantity,
            category,
            supplier,
            minimumStock
        } = req.body;

        // Validate price
        if (price !== undefined && price < 0) {
            return res.status(400).json({
                message: "Price cannot be negative"
            });
        }

        // Validate quantity
        if (quantity !== undefined && quantity < 0) {
            return res.status(400).json({
                message: "Quantity cannot be negative"
            });
        }

        // Validate minimum stock
        if (minimumStock !== undefined && minimumStock < 0) {
            return res.status(400).json({
                message: "Minimum stock cannot be negative"
            });
        }

        // Validate category ID if provided
        if (
            category !== undefined &&
            !mongoose.Types.ObjectId.isValid(category)
        ) {
            return res.status(400).json({
                message: "Invalid category ID"
            });
        }

        // Validate supplier ID if provided
        if (
            supplier !== undefined &&
            !mongoose.Types.ObjectId.isValid(supplier)
        ) {
            return res.status(400).json({
                message: "Invalid supplier ID"
            });
        }

        // Check duplicate SKU
        if (sku !== undefined) {
            const existingProduct = await Product.findOne({
                sku,
                _id: { $ne: id }
            });

            if (existingProduct) {
                return res.status(400).json({
                    message: "Product with this SKU already exists"
                });
            }
        }

        const product = await Product.findByIdAndUpdate(
            id,
            {
                name,
                sku,
                description,
                price,
                quantity,
                category,
                supplier,
                minimumStock
            },
            {
                new: true,
                runValidators: true
            }
        )
            .populate("category", "name")
            .populate("supplier", "name");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
};
// Delete a product
// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
};
module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    


};