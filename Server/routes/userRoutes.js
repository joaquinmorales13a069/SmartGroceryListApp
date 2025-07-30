import express from "express";
import {
    signup,
    login,
    getMe,
    updateMe,
    deleteMe,
    listUsers,
    adminCreateUser,
    getUserById,
    adminUpdateUser,
    adminChangeUserType,
    adminDeleteUser,
} from "../controllers/userControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/users/signup - User registration endpoint
router.post("/signup", signup);

// POST /api/users/login - User login endpoint
router.post("/login", login);

// User self-management
router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateMe);
router.delete("/me", authMiddleware, deleteMe);

// Admin user management
router.get("/", authMiddleware, listUsers); // admin only (checked in controller)
router.post("/", authMiddleware, adminCreateUser); // admin only
router.get("/:id", authMiddleware, getUserById); // admin only
router.patch("/:id", authMiddleware, adminUpdateUser); // admin only
router.patch("/:id/type", authMiddleware, adminChangeUserType); // admin only
router.delete("/:id", authMiddleware, adminDeleteUser); // admin only

export default router;
