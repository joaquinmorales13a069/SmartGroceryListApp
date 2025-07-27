import express from "express";
import { signup, 
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  downloadHistory, } from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

// POST /api/users/signup - User registration endpoint
router.post("/signup", signup);

// POST /api/users/login - User login endpoint
router.post("/login", login);

// added this
router.get("/profile", protect, getProfile, async (req, res) => {
  res.status(200).json(req.user);
});

// PUT /api/users/profile - Update user profile
router.put("/profile", protect, updateProfile);

// PUT /api/users/change-password - Change password
router.put("/change-password", protect, changePassword);

// DELETE /api/users/delete - Delete user account
router.delete("/delete", protect, deleteAccount);

router.get("/download-history", protect, downloadHistory);


export default router;
