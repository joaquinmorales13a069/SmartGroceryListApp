import express from "express";
import userRoutes from "./userRoutes.js";

const router = express.Router();

// Mount user routes at /users
router.use("/users", userRoutes);

// Future routes can be added here
// router.use("/orders", orderRoutes);
// router.use("/meals", mealRoutes);
// router.use("/admin", adminRoutes);

export default router;
