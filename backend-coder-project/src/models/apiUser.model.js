import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    avatar: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, required: true }
}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);

export const User = userModel;