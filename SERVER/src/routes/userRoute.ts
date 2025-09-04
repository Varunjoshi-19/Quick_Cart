import express from "express";
import multer, { memoryStorage } from "multer";
import { handleSaveGoogleLogin, handleSignUp, handleUpdateUserDetails, handleUserLogin, handleChangePassword } from "../controllers/user";



const router = express.Router();
const upload = multer({
    storage: memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }
});

router.post("/login", handleUserLogin);
router.post("/google-login" , handleSaveGoogleLogin);
router.post("/signup", handleSignUp);
router.post("/update-user", upload.single("file"), handleUpdateUserDetails);

router.post("/change-password", handleChangePassword);


export default router;