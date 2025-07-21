import express from "express";
import { createGroceryList, deleteGroceryList } from "../controllers/groceryListController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// GET all grocery lists

// GET specific grocery list by id

// POST new grocery list
router.post("/", authMiddleware, createGroceryList);
// UPDATE grocery list

// DELETE grocery list
router.delete("/:id", authMiddleware, deleteGroceryList);

export default router;