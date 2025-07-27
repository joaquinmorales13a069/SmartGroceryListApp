import PantryItem from '../models/pantryModel.js';

// @desc Get user's pantry items
export const getPantryItems = async (req, res) => {
  try {
    const items = await PantryItem.find({ user: req.user._id });
    res.json(items);
  } catch (error) {
    console.error("Error fetching pantry items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Add new pantry item
export const addPantryItem = async (req, res) => {
  try {
    const {
      name,
      quantity,
      unit,
      category,
      expiryDate,
      description,
      price,
      nutrition = [], // Support array of { type, value }
    } = req.body;

    const newItem = await PantryItem.create({
      user: req.user._id,
      name,
      quantity,
      unit,
      category,
      expiryDate,
      description,
      price,
      nutrition,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding pantry item:", error);
    res.status(500).json({ message: "Failed to add item" });
  }
};

// @desc Update pantry item
export const updatePantryItem = async (req, res) => {
  try {
    const item = await PantryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedFields = {
      ...req.body,
      nutrition: req.body.nutrition || item.nutrition,
      price: Number(req.body.price || 0)
    };

    const updatedItem = await PantryItem.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating pantry item:", error);
    res.status(500).json({ message: "Failed to update item" });
  }
};

// @desc Delete pantry item
export const deletePantryItem = async (req, res) => {
  try {
    const item = await PantryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error during deletion" });
  }
};
