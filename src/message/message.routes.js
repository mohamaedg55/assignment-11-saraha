import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { getMessages, sendMessage } from "./message.controller.js";

const router = express.Router(); 

router.get("/", authMiddleware, getMessages);
router.post("/", authMiddleware, sendMessage);

export default router;
