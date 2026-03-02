import express from "express";
import {
    register,
    login,
    uploadCoverImages,
    uploadProfileImage,
    removeProfileImage,
    visitProfile
} from "./auth.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.patch(
    "/upload-cover",
    authMiddleware,
    upload.array("coverImages", 2),
    uploadCoverImages
);

router.patch(
    "/upload-profile",
    authMiddleware,
    upload.single("profileImage"),
    uploadProfileImage
);

router.delete(
    "/remove-profile",
    authMiddleware,
    removeProfileImage
);

router.get(
    "/profile/:id",
    authMiddleware,
    visitProfile
);

export default router;