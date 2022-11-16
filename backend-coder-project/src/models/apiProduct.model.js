import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: {type: String, required: true}
}, { timestamps: true });

const productModel = mongoose.model("productos", productSchema);

export const Product = productModel;