import type { Request, Response } from "express";
import { handleUploadFile, HashedPasswordAndSalting } from "../utils/index";
import type { UserProps, updateProfileProps } from "../interfaces/index";
import dbConnections from "../database/connection";
import crypto from "crypto";
import globalConfig from "../config/index";

class userServices {


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
            const newHash = crypto.createHmac("sha256", user.salt).update(password).digest("hex");
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

            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                res.status(404).json({ errorMessage: 'failed to sign up! ' });
                return;
            }

            const { salt, hashpassword } = HashedPasswordAndSalting(password);

            const data: UserProps = {
                name: name,
                email: email,
                password: hashpassword,
                salt: salt,
            }

            const prisma = dbConnections.getPrismaConnection();

            const newUser = await prisma.user.create({
                data: data
            });

            if (!newUser) {
                res.status(404).json({ errorMessage: "failed to create user " });
                return;
            }
            res.status(200).json({ message: "User created and signup" });

        } catch (err: unknown) {
            console.error(err);
            res.status(505).json({ errorMessage: `Internal error ${err}` })

        }


    }

    async handleUpdateUserProfile(req: Request, res: Response) {

        try {
            const { userId, newName } = req.body;
            const file = req.file;

            if (!userId) {
                return res.status(400).json({ errorMessage: "User id required!" });
            }
            const uploadData: updateProfileProps = {};
            if (newName) uploadData.name = newName;

            if (file) {
                const result = await handleUploadFile(file, globalConfig.quickCartBucketId);
                if (!result.success) {
                    return res.status(400).json({ errorMessage: result.message });
                }
                if (result.imageUrl && result.fileId) {
                    {
                        uploadData.imageData = {
                            url: result.imageUrl,
                            fileId: result.fileId
                        }
                    }
                }


            }


            const prisma = dbConnections.getPrismaConnection();

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