import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [100, "Item name cannot exceed 100 characters"],
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    batchNumber: {
      type: String,
      trim: true,
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
    // Optional nutrition facts skeleton
    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    /**
     * Optional: who created this catalog entry.
     * Enables basic moderation / ownership checks.
     */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

// Create index for efficient searching by name
itemSchema.index({ name: "text" });

const Item = mongoose.model("Item", itemSchema);
export default Item;
