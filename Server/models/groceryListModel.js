import mongoose from "mongoose";

const groceryItemSubSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      validate: {
        validator: function (val) {
          // allow missing expiry, but if provided it must be today or later
          return !val || val >= new Date().setHours(0, 0, 0, 0);
        },
        message: "Expiry date must be today or in the future",
      },
    },
  },
  { _id: false } // prevent Mongo from adding an extra _id to each sub-document
);

const groceryListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "List name is required"],
      trim: true,
      maxlength: [100, "List name cannot exceed 100 characters"],
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    items: [groceryItemSubSchema],

    /**
     * We embed meal-plan objects right here for simplicity.
     * Store whatever structure your AI service returns (JSON).
     */
    mealPlans: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  { timestamps: true }
);

// Convenience virtual: total number of items
groceryListSchema.virtual("totalItems").get(function () {
  return this.items.reduce((acc, i) => acc + i.quantity, 0);
});

// Ensure virtuals are included when sending JSON
groceryListSchema.set("toJSON", { virtuals: true });

const GroceryList = mongoose.model("GroceryList", groceryListSchema);
export default GroceryList;
