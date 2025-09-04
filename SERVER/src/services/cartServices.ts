import type { Request, Response } from "express";
import CartItem from "../schema/cartItemDoc";

class CartServices {

    async getUserCart(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(400).json({ errorMessage: "User id required" });
                return;
            }

            const items = await CartItem.find({ userId }).lean();
            res.status(200).json({ items });
        } catch (error: any) {
            res.status(500).json({ errorMessage: error?.message || "Failed to fetch cart" });
        }
    }

    async addToCart(req: Request, res: Response) {
        try {
            const { userId, productId, quantity = 1, name, price, imageUrl } = req.body as { userId: string, productId: string, quantity?: number, name?: string, price?: number, imageUrl?: string };
            if (!userId || !productId) {
                res.status(400).json({ errorMessage: "userId and productId required" });
                return;
            }
            if (!name || typeof price !== 'number') {
                res.status(400).json({ errorMessage: "name and price required" });
                return;
            }

            try {
                const item = await CartItem.create({ userId, productId, quantity, name, price, imageUrl });
                res.status(201).json({ message: "Added to cart", item });
                return;
            } catch (err: any) {
                // duplicate due to unique index (userId, productId)
                if (err?.code === 11000) {
                    res.status(409).json({ errorMessage: "Product already in cart" });
                    return;
                }
                throw err;
            }
        } catch (error: any) {
            res.status(500).json({ errorMessage: error?.message || "Failed to add to cart" });
        }
    }

    async updateCartQuantity(req: Request, res: Response) {
        try {
            const { userId, productId, quantity } = req.body as { userId: string, productId: string, quantity: number };
            if (!userId || !productId || typeof quantity !== 'number') {
                res.status(400).json({ errorMessage: "userId, productId and quantity required" });
                return;
            }

            if (quantity <= 0) {
                await CartItem.deleteOne({ userId, productId });
                res.status(200).json({ message: "Removed from cart" });
                return;
            }

            const updated = await CartItem.findOneAndUpdate(
                { userId, productId },
                { $set: { quantity } },
                { new: true, upsert: true }
            ).lean();

            res.status(200).json({ message: "Cart updated", item: updated });
        } catch (error: any) {
            res.status(500).json({ errorMessage: error?.message || "Failed to update cart" });
        }
    }

    async removeFromCart(req: Request, res: Response) {
        try {
            const { userId, productId } = req.body as { userId: string, productId: string };
            if (!userId || !productId) {
                res.status(400).json({ errorMessage: "userId and productId required" });
                return;
            }
            await CartItem.deleteOne({ userId, productId });
            res.status(200).json({ message: "Removed from cart" });
        } catch (error: any) {
            res.status(500).json({ errorMessage: error?.message || "Failed to remove from cart" });
        }
    }
}

export default new CartServices();


