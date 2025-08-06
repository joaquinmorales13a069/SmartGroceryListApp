import express from "express";
import {
  createGroceryList,
  deleteGroceryList,
  generateMealPlans,
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

// POST generate meal plans manually 
router.post("/:id/generate-meal-plan", authMiddleware, generateMealPlans)

export default router;
