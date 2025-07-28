import express from "express";
import {
  createGroceryList,
  deleteGroceryList,
  getAllGroceryLists,
  getGroceryListById,
  updateGroceryList,
} from "../controllers/groceryListController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all grocery lists for logged-in user
router.get("/", authMiddleware, getAllGroceryLists);

// GET a specific grocery list by ID
router.get("/:id", authMiddleware, getGroceryListById);

// POST new grocery list
router.post("/", authMiddleware, createGroceryList);
// UPDATE grocery list

router.patch("/:id", authMiddleware, updateGroceryList);

// DELETE grocery list
router.delete("/:id", authMiddleware, deleteGroceryList);

export default router;
