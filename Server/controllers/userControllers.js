import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Controller for user signup
export const signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            dateOfBirth,
            weight,
            height,
            dietaryPreferences, // From frontend
            favoriteMeal, // From frontend
        } = req.body;

        // Validate required fields
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !dateOfBirth ||
            !weight ||
            !height ||
            !favoriteMeal
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // Validate date of birth is in the past
        const dob = new Date(dateOfBirth);
        if (dob >= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Date of birth must be in the past",
            });
        }

        // Validate weight and height ranges
        if (weight <= 0 || weight > 1000) {
            return res.status(400).json({
                success: false,
                message: "Weight must be between 1 and 1000 kg",
            });
        }

        if (height <= 0 || height > 300) {
            return res.status(400).json({
                success: false,
                message: "Height must be between 1 and 300 cm",
            });
        }

        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Map frontend field names to model field names
        const userData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword, // Use hashed password
            dateOfBirth: dob,
            weight: Number(weight),
            height: Number(height),
            dietaryPreference: dietaryPreferences || "None", // Map to model field name
            favouriteMeal: favoriteMeal.trim(), // Map to model field name
        };

        // Create new user
        const newUser = new User(userData);
        const savedUser = await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: savedUser._id,
                email: savedUser.email,
                userType: savedUser.userType,
            },
            process.env.JWT_SECRET || "fallback_secret_key", // Use environment variable for JWT secret
            { expiresIn: "7d" } // Token expires in 7 days
        );

        // Remove password from response
        const userResponse = savedUser.toJSON();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userResponse,
            token: token,
        });
    } catch (error) {
        console.error("Signup error:", error);

        // Handle mongoose validation errors
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors,
            });
        }

        // Handle duplicate key error (email already exists)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

// Controller for user login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                userType: user.userType,
            },
            process.env.JWT_SECRET || "fallback_secret_key",
            { expiresIn: "7d" }
        );

        console.log("Generated token:", token);
        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: userResponse,
            token: token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

// Helper: check if user is admin
const isAdmin = (user) => user.userType === "admin";

// Helper: filter out sensitive fields
const filterUser = (user) => {
    const obj = user.toJSON ? user.toJSON() : user;
    const { password, ...rest } = obj;
    return rest;
};

// GET /api/users/me - Get current user info
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.deleted)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        res.json({ success: true, user: filterUser(user) });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// PATCH /api/users/me - Update own info (require current password/email for password/email change)
export const updateMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.deleted)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        const {
            firstName,
            lastName,
            email,
            currentEmail,
            password,
            newPassword,
            currentPassword,
            dateOfBirth,
            weight,
            height,
            dietaryPreference,
            favouriteMeal,
        } = req.body;
        // If changing email, require confirmation of current email
        if (email && email !== user.email) {
            if (!currentEmail || currentEmail !== user.email) {
                return res.status(400).json({
                    success: false,
                    message: "Current email confirmation required",
                });
            }
            user.email = email.toLowerCase().trim();
        }
        // If changing password, require current password
        if (newPassword) {
            if (!currentPassword)
                return res.status(400).json({
                    success: false,
                    message: "Current password required",
                });
            const isValid = await bcrypt.compare(
                currentPassword,
                user.password
            );
            if (!isValid)
                return res.status(401).json({
                    success: false,
                    message: "Current password incorrect",
                });
            user.password = await bcrypt.hash(newPassword, 10);
        }
        if (firstName) user.firstName = firstName.trim();
        if (lastName) user.lastName = lastName.trim();
        if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
        if (weight) user.weight = Number(weight);
        if (height) user.height = Number(height);
        if (dietaryPreference) user.dietaryPreference = dietaryPreference;
        if (favouriteMeal) user.favouriteMeal = favouriteMeal.trim();
        await user.save();
        res.json({ success: true, user: filterUser(user) });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// DELETE /api/users/me - Soft delete own account
export const deleteMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.deleted)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        user.deleted = true;
        await user.save();
        res.json({ success: true, message: "Account deleted (soft delete)" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ADMIN: GET /api/users - List all users
export const listUsers = async (req, res) => {
    try {
        // Check if user is admin using JWT token data
        if (!isAdmin(req.user)) {
            return res
                .status(403)
                .json({ success: false, message: "Admin only" });
        }

        const users = await User.find({ deleted: { $ne: true } });
        res.json({ success: true, users: users.map(filterUser) });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ADMIN: POST /api/users - Create new user
export const adminCreateUser = async (req, res) => {
    try {
        // Check if user is admin using JWT token data
        if (!isAdmin(req.user)) {
            return res
                .status(403)
                .json({ success: false, message: "Admin only" });
        }

        const {
            firstName,
            lastName,
            email,
            password,
            dateOfBirth,
            weight,
            height,
            dietaryPreference,
            favouriteMeal,
            userType,
        } = req.body;
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !dateOfBirth ||
            !weight ||
            !height ||
            !favouriteMeal
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            dateOfBirth: new Date(dateOfBirth),
            weight: Number(weight),
            height: Number(height),
            dietaryPreference: dietaryPreference || "None",
            favouriteMeal: favouriteMeal.trim(),
            userType: userType || "user",
        };
        const newUser = new User(userData);
        await newUser.save();
        res.status(201).json({ success: true, user: filterUser(newUser) });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ADMIN: GET /api/users/:id - Get user by ID
export const getUserById = async (req, res) => {
    try {
        // Check if user is admin using JWT token data
        if (!isAdmin(req.user)) {
            return res
                .status(403)
                .json({ success: false, message: "Admin only" });
        }

        const user = await User.findById(req.params.id);
        if (!user || user.deleted)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        res.json({ success: true, user: filterUser(user) });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ADMIN: PATCH /api/users/:id - Update any user (can promote/demote, edit info)
export const adminUpdateUser = async (req, res) => {
    try {
        // Check if user is admin using JWT token data
        if (!isAdmin(req.user)) {
            return res
                .status(403)
                .json({ success: false, message: "Admin only" });
        }

        const user = await User.findById(req.params.id);
        if (!user || user.deleted)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        const {
            firstName,
            lastName,
            email,
            password,
            dateOfBirth,
            weight,
            height,
            dietaryPreference,
            favouriteMeal,
            userType,
        } = req.body;
        if (firstName) user.firstName = firstName.trim();
        if (lastName) user.lastName = lastName.trim();
        if (email) user.email = email.toLowerCase().trim();
        if (password) user.password = await bcrypt.hash(password, 10);
        if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
        if (weight) user.weight = Number(weight);
        if (height) user.height = Number(height);
        if (dietaryPreference) user.dietaryPreference = dietaryPreference;
        if (favouriteMeal) user.favouriteMeal = favouriteMeal.trim();
        if (userType && ["user", "admin"].includes(userType))
            user.userType = userType;
        await user.save();
        res.json({ success: true, user: filterUser(user) });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ADMIN: PATCH /api/users/:id/type - Promote/demote userType
export const adminChangeUserType = async (req, res) => {
    try {
        // Check if user is admin using JWT token data
        if (!isAdmin(req.user)) {
            return res
                .status(403)
                .json({ success: false, message: "Admin only" });
        }

        const user = await User.findById(req.params.id);
        if (!user || user.deleted)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        const { userType } = req.body;
        if (!["user", "admin"].includes(userType))
            return res
                .status(400)
                .json({ success: false, message: "Invalid userType" });
        user.userType = userType;
        await user.save();
        res.json({ success: true, user: filterUser(user) });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ADMIN: DELETE /api/users/:id - Soft delete any user
export const adminDeleteUser = async (req, res) => {
    try {
        // Check if user is admin using JWT token data
        if (!isAdmin(req.user)) {
            return res
                .status(403)
                .json({ success: false, message: "Admin only" });
        }

        const user = await User.findById(req.params.id);
        if (!user || user.deleted)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        user.deleted = true;
        await user.save();
        res.json({ success: true, message: "User deleted (soft delete)" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
