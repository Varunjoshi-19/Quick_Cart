import type { Request, Response } from "express";
import cartServices from "../services/cartServices";

export async function handleGetUserCart(req: Request, res: Response) {
    cartServices.getUserCart(req, res);
}

export async function handleAddToCart(req: Request, res: Response) {
    cartServices.addToCart(req, res);
}

export async function handleUpdateCartQuantity(req: Request, res: Response) {
    cartServices.updateCartQuantity(req, res);
}

export async function handleRemoveFromCart(req: Request, res: Response) {
    cartServices.removeFromCart(req, res);
}


