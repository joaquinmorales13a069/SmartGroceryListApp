import express from "express";
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/itemControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/items - List/search items with pagination
router.get("/", authMiddleware, getItems);

// POST /api/items - Create a new item
router.post("/", authMiddleware, createItem);

// New routes
router.get("/:itemId", authMiddleware, getItemById);
router.patch("/:itemId", authMiddleware, updateItem);
router.delete("/:itemId", authMiddleware, deleteItem);

export default router;
