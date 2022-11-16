import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    author: {
        email: { type: String, required: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        age: { type: Number, required: true },
        avatar: { type: String, required: true },
        role: { type: String, required: true },
        id: { type: mongoose.Schema.Types.ObjectId, required: true }
    },
    text: { type: String, required: true }
}, { timestamps: true });

const chatModel = mongoose.model("chats", chatSchema);

export const Chat = chatModel;