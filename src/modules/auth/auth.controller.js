import { User } from "./auth.model.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export const register = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ message: "Login successful", token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadCoverImages = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const existingCount = user.coverImages.length;
        const newCount = req.files ? req.files.length : 0;

        if (existingCount + newCount !== 2) {
            return res.status(400).json({
                message: "Total cover images must be exactly 2"
            });
        }

        const newImages = req.files.map(file => file.filename);
        user.coverImages = [...user.coverImages, ...newImages];

        await user.save();

        res.json({
            message: "Cover images uploaded successfully",
            coverImages: user.coverImages
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        if (user.profileImage) {
            user.gallery.push(user.profileImage);
        }

        user.profileImage = req.file.filename;

        await user.save();

        res.json({
            message: "Profile image updated successfully",
            profileImage: user.profileImage
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user.profileImage) {
            return res.status(400).json({ message: "No profile image to remove" });
        }

        const imagePath = path.join("uploads", user.profileImage);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        user.profileImage = null;
        await user.save();

        res.json({ message: "Profile image removed successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const visitProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        user.visitCount += 1;
        await user.save();

        const response = {
            name: user.name,
            profileImage: user.profileImage,
            coverImages: user.coverImages
        };


        if (req.user.role === "admin") {
            response.visitCount = user.visitCount;
        }

        res.json(response);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};