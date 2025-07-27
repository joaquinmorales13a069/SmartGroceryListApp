import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
}, { _id: false });

const pantryItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: 'pcs',
    },
    category: {
      type: String,
      default: 'General',
    },
    expiryDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default:0,
    },
    nutrition: {
      type: [nutritionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('PantryItem', pantryItemSchema);
