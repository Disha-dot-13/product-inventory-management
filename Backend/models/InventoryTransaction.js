const mongoose = require("mongoose");

const inventoryTransactionSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        type: {
            type: String,
            enum: ["IN", "OUT"],
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        reason: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "InventoryTransaction",
    inventoryTransactionSchema
);