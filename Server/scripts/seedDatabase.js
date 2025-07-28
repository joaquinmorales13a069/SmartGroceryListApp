import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "../models/itemModel.js";

// Load environment variables
dotenv.config();

// Sample data from the MongoDB template (without predefined ObjectIds)
const sampleItems = [
    {
        name: "apple",
        price: 0.5,
        batchNumber: "APL123",
        expiryDate: new Date("2025-08-01T00:00:00Z"),
        nutrition: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
        disabled: false,
    },
    {
        name: "banana",
        price: 0.3,
        batchNumber: "BAN456",
        expiryDate: new Date("2025-07-30T00:00:00Z"),
        nutrition: { calories: 96, protein: 1.3, carbs: 27, fat: 0.3 },
    },
    {
        name: "carrot",
        price: 0.2,
        batchNumber: "CAR789",
        nutrition: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
    },
    {
        name: "milk",
        price: 1.0,
        batchNumber: "MLK001",
        expiryDate: new Date("2025-09-15T00:00:00Z"),
        nutrition: { calories: 42, protein: 3.4, carbs: 5, fat: 1.0 },
    },
    {
        name: "bread",
        price: 2.5,
        batchNumber: "BRD002",
        expiryDate: new Date("2025-08-05T00:00:00Z"),
        nutrition: { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
    },
    {
        name: "egg",
        price: 0.2,
        batchNumber: "EGG003",
        expiryDate: new Date("2025-07-28T00:00:00Z"),
        nutrition: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    },
    {
        name: "chicken breast",
        price: 5.0,
        batchNumber: "CHK004",
        expiryDate: new Date("2025-08-10T00:00:00Z"),
        nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    },
    {
        name: "salmon fillet",
        price: 7.5,
        batchNumber: "SAL005",
        expiryDate: new Date("2025-08-12T00:00:00Z"),
        nutrition: { calories: 208, protein: 20, carbs: 0, fat: 13 },
    },
    {
        name: "rice",
        price: 1.2,
        batchNumber: "RIC006",
        nutrition: { calories: 130, protein: 2.4, carbs: 28, fat: 0.3 },
    },
    {
        name: "olive oil",
        price: 10.0,
        batchNumber: "OIL007",
        expiryDate: new Date("2026-01-01T00:00:00Z"),
        nutrition: { calories: 884, protein: 0, carbs: 0, fat: 100 },
    },
    {
        name: "almond",
        price: 15.0,
        batchNumber: "ALM008",
        expiryDate: new Date("2025-12-31T00:00:00Z"),
        nutrition: { calories: 579, protein: 21, carbs: 22, fat: 50 },
    },
    {
        name: "yogurt",
        price: 3.0,
        batchNumber: "YOG009",
        expiryDate: new Date("2025-08-20T00:00:00Z"),
        nutrition: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
        disabled: true,
    },
    {
        name: "spinach",
        price: 2.0,
        batchNumber: "SPN010",
        nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    },
    {
        name: "tomato",
        price: 0.8,
        batchNumber: "TOM011",
        expiryDate: new Date("2025-08-03T00:00:00Z"),
        nutrition: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
    },
    {
        name: "cheddar cheese",
        price: 4.0,
        batchNumber: "CHC012",
        expiryDate: new Date("2025-10-01T00:00:00Z"),
        nutrition: { calories: 402, protein: 25, carbs: 1.3, fat: 33 },
    },
    {
        name: "orange juice",
        price: 2.5,
        batchNumber: "OJ013",
        expiryDate: new Date("2025-07-29T00:00:00Z"),
        nutrition: { calories: 45, protein: 0.7, carbs: 10, fat: 0.2 },
    },
    {
        name: "broccoli",
        price: 1.8,
        batchNumber: "BRC014",
        expiryDate: new Date("2025-08-05T00:00:00Z"),
        nutrition: { calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
    },
    {
        name: "peanut butter",
        price: 6.0,
        batchNumber: "PBT015",
        expiryDate: new Date("2026-02-01T00:00:00Z"),
        nutrition: { calories: 588, protein: 25, carbs: 20, fat: 50 },
    },
    {
        name: "tofu",
        price: 2.2,
        batchNumber: "TOF016",
        expiryDate: new Date("2025-08-15T00:00:00Z"),
        nutrition: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8 },
    },
    {
        name: "protein powder",
        price: 25.0,
        batchNumber: "PRP017",
        nutrition: { calories: 120, protein: 24, carbs: 3, fat: 1 },
        disabled: true,
    },
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "ita602-database",
        });
        console.log("Connected to MongoDB successfully");

        // Clear existing items (optional - comment out if you want to keep existing data)
        await Item.deleteMany({});
        console.log("Cleared existing items");

        // Insert sample items
        const result = await Item.insertMany(sampleItems);
        console.log(
            `Successfully inserted ${result.length} items into the database`
        );

        // Display some sample items
        console.log("\nSample items inserted:");
        result.slice(0, 5).forEach((item) => {
            console.log(`- ${item.name}: $${item.price} (${item.batchNumber})`);
        });

        console.log("\nDatabase seeding completed successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log("Database connection closed");
        process.exit(0);
    }
};

// Run the seeding function
seedDatabase();
