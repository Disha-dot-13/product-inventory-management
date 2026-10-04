const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("../models/Product");
const Category = require("../models/Category");

dotenv.config();

const migrateProductCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected");

        // Find categories
        const electronicDevices = await Category.findOne({
            name: "Electronic Devices"
        });

        const accessories = await Category.findOne({
            name: "Accessories"
        });

        if (!electronicDevices || !accessories) {
            console.log("Required categories not found");
            await mongoose.connection.close();
            return;
        }

        // Update Laptop
        const laptop = await Product.findOne({
            name: "Laptop"
        });

        if (laptop && !laptop.category) {
            laptop.category = electronicDevices._id;
            await laptop.save();

            console.log(
                `Updated Laptop → ${electronicDevices.name}`
            );
        }

        // Update Wireless Mouse
        const mouse = await Product.findOne({
            name: "Wireless Mouse"
        });

        if (mouse && !mouse.category) {
            mouse.category = accessories._id;
            await mouse.save();

            console.log(
                `Updated Wireless Mouse → ${accessories.name}`
            );
        }

        console.log("Migration completed");

        await mongoose.connection.close();

    } catch (error) {
        console.error("Migration failed:", error.message);

        await mongoose.connection.close();

        process.exit(1);
    }
};

migrateProductCategories();