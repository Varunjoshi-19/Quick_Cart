import type { Request, Response } from "express";
import dbConnections from "../database/connection";
import Razorpay from "razorpay";
import crypto from "crypto";



class OtherServices {

    #razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_SECRET_KEY!
    })



    async paymentVerification(req: Request, res: Response) {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        console.log(req.body);
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest("hex");

        if (generated_signature !== razorpay_signature) {
            res.status(404).json({ errorMessage: "payment verification failed!" });
            return;
        }

        res.status(200).json({ message: "payment verified and successful" });
        return;
    }

    async orderPayment(req: Request, res: Response) {

        const { amount, currency } = req.body;
        console.log(amount, currency);

        const options = {
            amount: amount * 100,
            currency: currency || 'INR',
            receipt: `order_rcptid_${Date.now()}`
        }

        try {
            const order = await this.#razorpay.orders.create(options);
            console.log("order id", order.id);
            res.json(order.id);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Error creating order");
        }
    }

    async saveOrder(req: Request, res: Response) {
        const { userId, orderId, paymentId, userName, productName, totalAmount, address } = req.body;

        if (!userId || !orderId || !paymentId || !userName || !productName || !totalAmount || !address) {
            res.status(400).json({ errorMessage: "Missing required order details" });
            return;
        }

        const prisma = dbConnections.getPrismaConnection();

        try {
            const newOrder = await prisma.order.create({
                data: {
                    userId,
                    orderId,
                    paymentId,
                    userName,
                    productName,
                    totalAmount,
                    address
                }
            });

            console.log(newOrder);
            if (!newOrder) {
                res.status(500).json({ errorMessage: "Failed to save order" });
                return;
            }

            res.status(201).json(newOrder);
        } catch (error) {
            console.error("Error saving order:", error);
            res.status(500).json({ errorMessage: "Failed to save order" });
        }
    }

    async getAllOrders(req: Request, res: Response) {
        const { id } = req.params;
        const prisma = dbConnections.getPrismaConnection();
        try {
            const orders = await prisma.order.findMany({
                where: {
                    userId: id
                },
                select: {
                    orderId: true,
                    paymentId: true,
                    productName: true,
                    userId: true,
                    userName: true,
                    status: true,
                    totalAmount: true,
                    address: true,
                    createdAt: true
                }
            });
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ errorMessage: "Failed to fetch orders" });
        }

    }

}

export default new OtherServices;