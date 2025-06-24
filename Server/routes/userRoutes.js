import express from "express";
import { signup, login } from "../controllers/userControllers.js";

const router = express.Router();

// POST /api/users/signup - User registration endpoint
router.post("/signup", signup);

// POST /api/users/login - User login endpoint
router.post("/login", login);

export default router;
