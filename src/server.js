import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./modules/auth/auth.routes.js";
import messageRoutes from "./modules/message/message.routes.js";
import path from "path";

dotenv.config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


connectDB();


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


app.get("/", (req, res) => {
    res.send("Assignment 11 API is running");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
