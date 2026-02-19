import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./auth.model.js";
import { sendEmail } from "../../utils/sendEmail.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const OTP_EXPIRATION = process.env.OTP_EXPIRATION || 5;

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashed = bcrypt.hashSync(password, 8);
    const otp = generateOTP();
    const otpExpires = Date.now() + OTP_EXPIRATION * 60 * 1000; 

    try {
        const user = await User.create({
            username,
            email,
            password: hashed,
            otp,
            otpExpires,
            isVerified: false
        });

       
        await sendEmail(email, otp);

        res.json({
            message: "OTP generated successfully and sent to email",
            otp: otp
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Wrong OTP" });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Account verified successfully" });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(400).json({ message: "Please verify your account first" });

    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        message: "Login successful",
        token: token
    });
};

export const updateUser = async (req, res) => {
    try {
        const updates = { ...req.body };

        
        if (req.file) {
            updates.profileImage = req.file.filename;
        }

     
        if (updates.password) delete updates.password;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true }
        ).select("-password");

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
