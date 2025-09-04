import express from "express";
import multer, { memoryStorage } from "multer";
import { handleAddNewProduct, handleGetCategoryProducts, handleGetProducts } from "../controllers/product";

const router = express.Router();
const upload = multer({
    storage: memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }
});


router.post("/new-product", upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'relatedPics', maxCount: 3 },
]), handleAddNewProduct);


router.get("/get-products", handleGetProducts);
router.get("/category-products/:category", handleGetCategoryProducts);

export default router;