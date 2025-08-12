import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "ita602-database",
        });
        console.log("Connected to MongoDB successfully");

        // Admin user data
        const adminUserData = {
            firstName: "Admin",
            lastName: "User",
            email: "admin@dailicious.com",
            password: "admin123456", // This will be hashed
            dateOfBirth: new Date("1990-01-01"), // Example date
            weight: 70, // kg
            height: 175, // cm
            dietaryPreference: "None",
            favouriteMeal: "Pasta",
            userType: "admin",
        };

        // Check if admin user already exists
        const existingAdmin = await User.findOne({
            email: adminUserData.email,
        });
        if (existingAdmin) {
            console.log("Admin user already exists!");
            console.log("Email:", adminUserData.email);
            console.log("Password:", adminUserData.password);
            console.log("User ID:", existingAdmin._id);
            console.log("User Type:", existingAdmin.userType);
            return;
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(
            adminUserData.password,
            saltRounds
        );

        // Create admin user
        const adminUser = new User({
            ...adminUserData,
            password: hashedPassword,
        });

        const savedAdmin = await adminUser.save();

        console.log("Admin user created successfully!");
        console.log("Email:", adminUserData.email);
        console.log("Password:", adminUserData.password);
        console.log("User ID:", savedAdmin._id);
        console.log("User Type:", savedAdmin.userType);

        console.log("\nYou can now login with these credentials:");
        console.log("Email: admin@dailicious.com");
        console.log("Password: admin123456");
    } catch (error) {
        console.error("Error creating admin user:", error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log("Database connection closed");
        process.exit(0);
    }
};

// Run the admin user creation function
createAdminUser();
