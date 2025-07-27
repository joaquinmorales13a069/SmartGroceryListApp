import ShoppingItem from "../models/ShoppingItem.js";

export async function getShoppingList(req, res) {
  try {
    const items = await ShoppingItem.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch list", error: err.message });
  }
}

export async function addShoppingItem(req, res) {
  try {
    const { name, category, tag, mealName } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!name) return res.status(400).json({ message: "Item name is required" });

    const item = new ShoppingItem({ userId, name, category, tag, mealName });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Add Item Error:", err.message);
    res.status(500).json({ message: "Failed to add item", error: err.message });
  }
}

export async function togglePurchased(req, res) {
  try {
    const item = await ShoppingItem.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.purchased = !item.purchased;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Toggle failed", error: err.message });
  }
}

export async function deleteShoppingItem(req, res) {
  try {
    const item = await ShoppingItem.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
}

export async function updateShoppingItem(req, res) {
  try {
    const { name, category, tag, mealName } = req.body;
    const item = await ShoppingItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, category, tag, mealName },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
}
