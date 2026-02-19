import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: String,
    receiverId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
