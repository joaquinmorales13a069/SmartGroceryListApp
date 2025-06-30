import express from "express";
import { createItem, getItems } from "../controllers/itemControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/items - List/search items with pagination
router.get("/", authMiddleware, getItems);

// POST /api/items - Create a new item
router.post("/", authMiddleware, createItem);

export default router;