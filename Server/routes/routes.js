import express from "express";
import userRoutes from "./userRoutes.js";
import itemRoutes from "./itemRoutes.js";

const router = express.Router();

// Mount user routes at /users
router.use("/users", userRoutes);

// Mount item routes at /items
router.use("/items", itemRoutes);

// Future routes can be added here
// router.use("/orders", orderRoutes);
// router.use("/meals", mealRoutes);
// router.use("/admin", adminRoutes);

export default router;
