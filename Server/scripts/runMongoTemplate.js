import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

const runMongoTemplate = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "ita602-database",
        });
        console.log("Connected to MongoDB successfully");

        // Read the template file
        const templatePath =
            "/Users/joaquinmorales13a06/.dbclient/storage/1751345818453@@panel.joaquinmorales.dev@27017@ita602-database/mongo-template.dbclient-js";

        if (!fs.existsSync(templatePath)) {
            console.error("Template file not found at:", templatePath);
            return;
        }

        const templateContent = fs.readFileSync(templatePath, "utf8");
        console.log("Template file read successfully");

        // Extract the data array from the template
        // Remove the db().collection().insertMany() wrapper and extract just the array
        const dataMatch = templateContent.match(/insertMany\(\[([\s\S]*)\]\)/);

        if (!dataMatch) {
            console.error("Could not extract data from template");
            return;
        }

        // Convert the MongoDB shell syntax to JavaScript objects
        let dataString = dataMatch[1];

        // Replace MongoDB-specific syntax with JavaScript
        dataString = dataString
            .replace(
                /ObjectId\("([^"]+)"\)/g,
                'new mongoose.Types.ObjectId("$1")'
            )
            .replace(/ISODate\("([^"]+)"\)/g, 'new Date("$1")')
            .replace(/(\w+):/g, '"$1":') // Quote property names
            .replace(/,(\s*})/g, "$1"); // Remove trailing commas

        // Parse the data
        const items = JSON.parse(`[${dataString}]`);
        console.log(`Parsed ${items.length} items from template`);

        // Get the items collection
        const db = mongoose.connection.db;
        const collection = db.collection("items");

        // Clear existing items
        await collection.deleteMany({});
        console.log("Cleared existing items");

        // Insert the items
        const result = await collection.insertMany(items);
        console.log(`Successfully inserted ${result.insertedCount} items`);

        // Display sample items
        console.log("\nSample items inserted:");
        const sampleItems = await collection.find({}).limit(5).toArray();
        sampleItems.forEach((item) => {
            console.log(`- ${item.name}: $${item.price} (${item.batchNumber})`);
        });

        console.log("\nTemplate execution completed successfully!");
    } catch (error) {
        console.error("Error running template:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed");
        process.exit(0);
    }
};

// Run the template
runMongoTemplate();
