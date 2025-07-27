import express from "express";
import userRoutes from "./userRoutes.js";
import pantryRoutes from "./pantryRoutes.js";
import budgetRoutes from "./budgetRoutes.js";
import shoppingRoutes from "./ShoppingRoutes.js";

const router = express.Router();

// Mount user routes at /users
router.use("/users", userRoutes);

// Future routes can be added here
// router.use("/pantry", pantryRoutes);
router.use("/pantry", pantryRoutes);

router.use("/budget", budgetRoutes);

router.use("/shopping", shoppingRoutes);

// router.use("/meals", mealRoutes);
// router.use("/admin", adminRoutes);

export default router;
