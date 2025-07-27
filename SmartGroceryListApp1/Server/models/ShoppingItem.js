import mongoose from "mongoose";

const ShoppingItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  category: String,
  tag: String,
  mealName: String,
  purchased: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const ShoppingItem = mongoose.model("ShoppingItem", ShoppingItemSchema);
export default ShoppingItem;
