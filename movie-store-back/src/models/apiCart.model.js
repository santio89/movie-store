import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  productos: { type: Array, required: true },
}, { timestamps: true });

const cartModel = mongoose.model("carts", cartSchema);

export const Cart = cartModel;