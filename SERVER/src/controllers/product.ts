import type { Request, Response } from "express";
import productServices from "../services/productServices";

export function handleAddNewProduct(req : Request , res : Response) {
        productServices.AddNewProduct(req , res);
}
 
export async function handleGetProducts(req: Request, res: Response) {
     productServices.FetchProducts(req , res);
}

export async function handleGetCategoryProducts(req :Request ,res : Response) { 
        productServices.SingleCategoryProduct(req ,res);
}