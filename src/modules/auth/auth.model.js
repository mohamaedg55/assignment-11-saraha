import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },

    otp: String,
    otpExpires: Date,

    isVerified: {
        type: Boolean,
        default: false
    },

    profileImage: {
        type: String
    },

    coverImages: {
        type: [String],   
        default: []
    },

    gallery: {
        type: [String],   
        default: []
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    visitCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 8);
    }
    next();
});

export const User = mongoose.model("User", userSchema);