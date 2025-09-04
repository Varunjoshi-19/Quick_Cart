import express from "express";
import multer, { memoryStorage } from "multer";
import { handleSignUp, handleUpdateUserDetails, handleUserLogin } from "../controllers/user";



const router = express.Router();
const upload = multer({
    storage: memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }
});

router.post("/login", handleUserLogin);
router.post("/signup", handleSignUp);
router.post("/update-user", upload.single("file"), handleUpdateUserDetails);


export default router;