import GroceryList from "../models/groceryListModel.js";

// ✅ Create Grocery List
export const createGroceryList = async (req, res) => {
  const { name, items, mealPlans } = req.body;

  // Validate fields
  if (
    !name ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !Array.isArray(mealPlans)
  ) {
    return res.status(400).json({
      success: false,
      message: "One or more required fields are missing",
    });
  }

  // Validate items
  for (const entry of items) {
    if (!entry.item || !entry.quantity) {
      return res.status(400).json({
        success: false,
        message: "Each item must have an item and quantity",
      });
    }
    if (entry.quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }
    if (
      entry.expiryDate &&
      new Date(entry.expiryDate) < new Date().setHours(0, 0, 0, 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be today or in the future",
      });
    }
  }

  // Validate meal plans
  if (mealPlans.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Meal plans array cannot be empty",
    });
  }

  try {
    // ✅ Use correct field name from schema: user
    const groceryList = new GroceryList({
      name,
      items,
      mealPlans,
      user: req.user.userId, // FIXED (not createdBy)
    });

    const newGroceryList = await groceryList.save();

    res.status(201).json({
      success: true,
      message: "Grocery list created successfully",
      data: newGroceryList,
    });
  } catch (error) {
    console.error("Error creating grocery list:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating grocery list",
    });
  }
};

// ✅ Delete Grocery List
export const deleteGroceryList = async (req, res) => {
  const { id } = req.params;

  try {
    const groceryList = await GroceryList.findOne({
      _id: id,
      user: req.user.userId, // FIXED
    });

    if (!groceryList) {
      return res.status(404).json({
        success: false,
        message: "Grocery list not found",
      });
    }

    await GroceryList.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Grocery list deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting grocery list:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting grocery list",
    });
  }
};

// ✅ Get All Lists
export const getAllGroceryLists = async (req, res) => {
  try {
    const lists = await GroceryList.find({ user: req.user.userId })
      .populate("items.item", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: lists,
    });
  } catch (error) {
    console.error("Error fetching grocery lists:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching grocery lists",
    });
  }
};

// ✅ Get Single List
export const getGroceryListById = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await GroceryList.findOne({
      _id: id,
      user: req.user.userId,
    }).populate("items.item", "name price");

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "Grocery list not found",
      });
    }

    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("Error fetching grocery list by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching grocery list",
    });
  }
};

// ✅ Update Grocery List
export const updateGroceryList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, mealPlans } = req.body;

    const list = await GroceryList.findOne({
      _id: id,
      user: req.user.userId, // FIXED
    });

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "Grocery list not found",
      });
    }

    if (name) list.name = name.trim();
    if (status && ["active", "completed"].includes(status))
      list.status = status;
    if (mealPlans && Array.isArray(mealPlans)) list.mealPlans = mealPlans;

    await list.save();

    res.status(200).json({
      success: true,
      message: "Grocery list updated successfully",
      data: list,
    });
  } catch (error) {
    console.error("Error updating grocery list:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating grocery list",
    });
  }
};
