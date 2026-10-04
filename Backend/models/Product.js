const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },

        description: {
            type: String,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"]
        },

        quantity: {
            type: Number,
            required: true,
            min: [0, "Quantity cannot be negative"]
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true
        },

        minimumStock: {
            type: Number,
            required: true,
            min: [0, "Minimum stock cannot be negative"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);