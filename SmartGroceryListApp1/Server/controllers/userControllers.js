
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Parser } from "json2csv"; // for CSV export

// ---------------------- SIGNUP ----------------------
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
      dietaryPreferences,
      favoriteMeal,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !dateOfBirth || !weight || !height || !favoriteMeal) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });

    const dob = new Date(dateOfBirth);
    if (dob >= new Date()) return res.status(400).json({ success: false, message: "Date of birth must be in the past" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      dateOfBirth: dob,
      weight: Number(weight),
      height: Number(height),
      dietaryPreference: dietaryPreferences || "None",
      favouriteMeal: favoriteMeal.trim(),
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ userId: savedUser._id, email: savedUser.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const userResponse = savedUser.toJSON();
    delete userResponse.password;

    res.status(201).json({ success: true, user: userResponse, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ---------------------- LOGIN ----------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({ success: true, user: userResponse, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------- GET PROFILE ----------------------
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- UPDATE PROFILE ----------------------
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.dietaryPreference = req.body.dietaryPreference || user.dietaryPreference;
    user.favouriteMeal = req.body.favouriteMeal || user.favouriteMeal;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- CHANGE PASSWORD ----------------------
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- DELETE ACCOUNT ----------------------
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- DOWNLOAD GROCERY HISTORY ----------------------
export const downloadHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    const orders = user.orders || [];

    if (!orders.length) return res.status(404).json({ message: "No grocery history found." });

    const fields = ["date", "items", "tags"];
    const parser = new Parser({ fields });
    const csv = parser.parse(orders);

    res.header("Content-Type", "text/csv");
    res.attachment("grocery_history.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Error generating history CSV" });
  }
};
