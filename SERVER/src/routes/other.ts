import express from "express";
import { handleOrderPayment, handlePaymentVerify, handleSaveOrder } from "../controllers/other";

const router = express.Router();


router.post("/order/payment", handleOrderPayment);
router.post("/payment/verify", handlePaymentVerify);
router.post("/order/place-order", handleSaveOrder);


export default router;