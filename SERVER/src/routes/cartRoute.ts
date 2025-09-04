import express from "express";
import { handleAddToCart, handleGetUserCart, handleRemoveFromCart, handleUpdateCartQuantity } from "../controllers/cart";

const router = express.Router();

router.get("/:userId", handleGetUserCart);
router.post("/add", handleAddToCart);
router.post("/update", handleUpdateCartQuantity);
router.post("/remove", handleRemoveFromCart);

export default router;


