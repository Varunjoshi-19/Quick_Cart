import type { Request, Response } from "express";
import otherServices from "../services/otherServices";


export function handleOrderPayment(req: Request, res: Response) {
    otherServices.orderPayment(req, res);
}

export function handleSaveOrder(req: Request, res: Response) {
    otherServices.saveOrder(req, res);
}

export function handlePaymentVerify(req: Request, res: Response) {
    otherServices.paymentVerification(req, res);
}


export function handleGetAllOrders(req: Request, res: Response) {
    otherServices.getAllOrders(req, res);
}