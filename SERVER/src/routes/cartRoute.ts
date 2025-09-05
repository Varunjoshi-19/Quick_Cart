import express from "express";
import { handleAddToCart, handleClearCart, handleGetUserCart, handleRemoveFromCart, handleUpdateCartQuantity } from "../controllers/cart";

const router = express.Router();

router.get("/:userId", handleGetUserCart);
router.post("/add", handleAddToCart);
router.post("/update", handleUpdateCartQuantity);
router.post("/remove", handleRemoveFromCart);

router.post("/clear/:userId", handleClearCart);

export default router;


