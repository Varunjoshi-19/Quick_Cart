import type { Request, Response } from "express";
import { handleUploadFile, HashedPasswordAndSalting } from "../utils/index";
import type { UserProps, updateProfileProps } from "../interfaces/index";
import dbConnections from "../database/connection";
import globalConfig from "../config/index";
import crypto, { randomUUID } from "crypto";


class userServices {
    async handleChangePassword(req: Request, res: Response) {
        try {
            const { userId, oldPassword, newPassword } = req.body;
            if (!userId || !oldPassword || !newPassword) {
                return res.status(400).json({ errorMessage: "All fields required!" });
            }
            const prisma = dbConnections.getPrismaConnection();
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ errorMessage: "User not found!" });
            }
            if (user.provider !== 'email') {
                return res.status(403).json({ errorMessage: "Password change only for email users." });
            }
            const oldHash = crypto.createHmac("sha256", user.salt!).update(oldPassword).digest("hex");
            if (oldHash !== user.password) {
                return res.status(401).json({ errorMessage: "Old password incorrect!" });
            }
            const { salt, hashpassword } = HashedPasswordAndSalting(newPassword);
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashpassword, salt }
            });
            return res.status(200).json({ message: "Password changed successfully!" });
        } catch (error) {
            console.error("Password change failed:", error);
            return res.status(500).json({ errorMessage: "Server error. Failed to change password." });
        }
    }


    async handleLogin(req: Request, res: Response) {

        try {

            const { email, password } = req.body;
            if (!email || !password) {
                res.status(404).json({ message: "email or password required" });
                return;
            }

            const prisma = dbConnections.getPrismaConnection();

            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (!user) {
                res.status(404).json({ errorMessage: "Invalid email!" });
                return;
            }

            if (user.provider && user.provider !== 'email') {
                res.status(404).json({ errorMessage: "Email doesn't exist" });
                return;
            }
            const newHash = crypto.createHmac("sha256", user.salt!).update(password).digest("hex");
            if (newHash !== user.password) {
                res.status(404).json({ errorMessage: "Incorrect Passcode!" });
                return;
            }

            const data = {
                id: user.id,
                name: user.name,
                email: user.email,
                imageData: user.imageData
            }


            res.status(200).json({ message: "Logged in successfully!", user: data });
            return;
        }
        catch (error) {
            console.log(error);
            res.status(505).json({ errorMessage: `Internal error ${error}` });
        }

    }

    async handleSignUp(req: Request, res: Response) {

        try {

            const { name, email, password, provider } = req.body;
            if (!name || !email || !password || !provider) {
                res.status(404).json({ message: 'failed to sign up! ' });
                return;
            }

            const { salt, hashpassword } = HashedPasswordAndSalting(password);

            const data: UserProps = {
                name: name,
                email: email,
                provider: provider,
                password: hashpassword,
                salt: salt,
            }

            const prisma = dbConnections.getPrismaConnection();

            let newUser;
            try {
                newUser = await prisma.user.create({
                    data: data
                });
            } catch (error: any) {
                if (error?.code === 'P2002') {
                    res.status(409).json({ errorMessage: 'Email already registered' });
                    return;
                }
                throw error;
            }

            if (!newUser) {
                res.status(404).json({ errorMessage: "failed to create user " });
                return;
            }
            res.status(200).json({ message: "User created and signup" });

        } catch (err: unknown) {
            console.error(err);
            res.status(505).json({ message: `Internal error ${err}` })

        }


    }

    async SaveGoogleLogin(req: Request, res: Response) {

        const { email, name, imageData: { url }, provider, providerId } = req.body;
        if (!email || !name || !url || !provider || !providerId) {
            return res.status(404).json({ message: "fields are missing!" });
        }
         
        


        const prisma = dbConnections.getPrismaConnection();
        const alreadyUser = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

 
       if(alreadyUser?.provider == "email") { 
        return res.status(404).json({ message: "User email already exists!" });
       }


        if (alreadyUser) {
            return res.status(200).json({ message: "logged in successfully!" , user : alreadyUser });
        }

        const imageId = randomUUID();
        const userData: UserProps = {
            name: name,
            email: email,
            imageData: {
                url: url,
                fileId: imageId
            },
            provider: provider,
            providerId: providerId
        }

        try {

            const user = await prisma.user.create({
                data: userData
            });

            if (!user) return res.status(404).json({ message: "failed to sign up  as google!" });


            res.status(202).json({ message: "sign up sucessfull with google!", user: user });
            return;

        } catch (error: any) {

            res.status(505).json({ message: error.message })
        }



    }

    async handleUpdateUserProfile(req: Request, res: Response) {

        try {
            const { userId, newName } = req.body;
            const file = req.file;

            if (!userId) {
                return res.status(400).json({ errorMessage: "User id required!" });
            }
            const prisma = dbConnections.getPrismaConnection();
            const user = await prisma.user.findUnique({ where: { id: userId } });
            const uploadData: updateProfileProps = {};
            if (newName) uploadData.name = newName;

            if (file) {
                // Delete old image from Appwrite if exists
                if (
                    user &&
                    user.imageData &&
                    typeof user.imageData === 'object' &&
                    'fileId' in user.imageData &&
                    typeof user.imageData.fileId === 'string'
                ) {
                    try {
                        const client = dbConnections.getAppWriteConnection();
                        const storage = new (require('appwrite').Storage)(client);
                        await storage.deleteFile(globalConfig.quickCartBucketId, user.imageData.fileId);
                    } catch (err) {
                        // Log error but continue
                        console.error('Failed to delete old image from Appwrite:', err);
                    }
                }
                // Upload new image
                const result = await require('../utils/index').handleUploadFile(file, globalConfig.quickCartBucketId);
                if (!result.success) {
                    return res.status(400).json({ errorMessage: result.message });
                }
                if (result.imageUrl && result.fileId) {
                    uploadData.imageData = {
                        url: result.imageUrl,
                        fileId: result.fileId
                    };
                }
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: uploadData
            });

            const data = {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
            };

            return res.status(200).json({ message: "User info updated!", user: data });
        } catch (error: any) {
            console.error("Update failed:", error);

            if (error.code === "P2002") {
                return res.status(409).json({ errorMessage: "Phone number already in use." });
            }

            return res.status(500).json({ errorMessage: "Server error. Failed to update profile." });
        }
    }




}


export default new userServices;