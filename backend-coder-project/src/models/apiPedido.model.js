import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema({
    user: {
        userId: { type: String, required: true },
        email: { type: String, required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    orden: {
        productos: { type: Array, required: true },
        totalItems: { type: Number, required: true },
        total: { type: Number, required: true },
        cartId: { type: String, required: true }
    }
}, { timestamps: true });

const pedidoModel = mongoose.model("pedidos", pedidoSchema);

export const Pedido = pedidoModel;

