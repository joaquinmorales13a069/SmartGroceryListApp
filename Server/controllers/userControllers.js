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
      const errors = Object.values(error.errors).map((err) => err.message);
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
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
