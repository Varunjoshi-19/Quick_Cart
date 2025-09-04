import type { Request, Response } from "express";
import userServices from "../services/userServices";


export async function handleUserLogin(req: Request, res: Response) {
    userServices.handleLogin(req, res);
}

export async function handleSaveGoogleLogin( req : Request , res : Response) {
      userServices.SaveGoogleLogin(req ,res);
}

export async function handleSignUp(req: Request, res: Response) {
    userServices.handleSignUp(req, res);
}



export async function handleUpdateUserDetails(req: Request, res: Response) {
    userServices.handleUpdateUserProfile(req, res);
}

export async function handleChangePassword(req: Request, res: Response) {
    userServices.handleChangePassword(req, res);
}
