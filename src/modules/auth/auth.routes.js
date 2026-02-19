import express from "express";
import { register, login, verifyOTP, updateUser } from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js"; 

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.patch("/", authMiddleware, upload.single("profileImage"), updateUser);

export default router;
