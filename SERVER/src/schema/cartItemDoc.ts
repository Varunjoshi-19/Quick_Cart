import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    // optional if you need variants (size, color, etc.)
    options: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

// Ensure one product per user (unique combo)
cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

const CartItem = mongoose.model("CartItem", cartItemSchema);

export default CartItem;
