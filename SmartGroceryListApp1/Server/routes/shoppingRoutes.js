

import express from "express";
import {
  getShoppingList,
  addShoppingItem,
  togglePurchased,
  deleteShoppingItem,
  updateShoppingItem
} from "../controllers/ShoppingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getShoppingList);
router.post("/", protect, addShoppingItem);
router.patch("/:id/toggle", protect, togglePurchased);
router.patch("/:id", protect, updateShoppingItem);
router.delete("/:id", protect, deleteShoppingItem);

export default router;
