const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("../models/Product");
const Supplier = require("../models/Supplier");

dotenv.config();

const migrateProductSuppliers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected");

        // Find suppliers
        const abcSuppliers = await Supplier.findOne({
            name: "ABC Suppliers"
        });

        const techWorld = await Supplier.findOne({
            name: "Tech World"
        });

        if (!abcSuppliers || !techWorld) {
            console.log("Required suppliers not found");
            await mongoose.connection.close();
            return;
        }

        // Update Laptop
        const laptop = await Product.findOne({
            name: "Laptop"
        });

        if (laptop && !laptop.supplier) {
            laptop.supplier = abcSuppliers._id;
            await laptop.save();

            console.log(
                `Updated Laptop → ${abcSuppliers.name}`
            );
        }

        // Update Wireless Mouse
        const mouse = await Product.findOne({
            name: "Wireless Mouse"
        });

        if (mouse && !mouse.supplier) {
            mouse.supplier = techWorld._id;
            await mouse.save();

            console.log(
                `Updated Wireless Mouse → ${techWorld.name}`
            );
        }

        // Update HP Laptop
        const hpLaptop = await Product.findOne({
            name: "HP Laptop"
        });

        if (hpLaptop && !hpLaptop.supplier) {
            hpLaptop.supplier = techWorld._id;
            await hpLaptop.save();

            console.log(
                `Updated HP Laptop → ${techWorld.name}`
            );
        }

        console.log("Supplier migration completed");

        await mongoose.connection.close();

    } catch (error) {
        console.error(
            "Supplier migration failed:",
            error.message
        );

        await mongoose.connection.close();

        process.exit(1);
    }
};

migrateProductSuppliers();