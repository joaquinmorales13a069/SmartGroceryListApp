import express from "express";
import userRoutes from "./userRoutes.js";
import itemRoutes from "./itemRoutes.js";
import groceryListRoutes from "./groceryListRoutes.js";

const router = express.Router();

// Mount user routes at /users
router.use("/users", userRoutes);

// Mount item routes at /items
router.use("/items", itemRoutes);

// Mount grocery list routes at /grocery-lists
router.use("/grocery-lists", groceryListRoutes);

export default router;
