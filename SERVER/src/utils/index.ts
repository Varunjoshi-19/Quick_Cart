import crypto from "crypto";
import { Storage, ID } from "appwrite";
import dbConnections from "../database/connection";


export function HashedPasswordAndSalting(password: string) {

  const salt = crypto.randomBytes(20).toString("hex");
  const hashpassword = crypto.createHmac("sha256", salt).update(password).digest("hex");

  return { salt, hashpassword };

}


export async function handleUploadFile(file: Express.Multer.File, bucketId: string) {

  const client = dbConnections.getAppWriteConnection();

  const storage = new Storage(client);

  const fileBlob = new Blob([file.buffer], { type: file.mimetype });
  const fileObject = new File([fileBlob], file.originalname, { type: file.mimetype });

  try {

    const result = await storage.createFile(
      bucketId,
      ID.unique(),
      fileObject

    )

    const url = storage.getFileView(bucketId, result.$id);
    if (!url) {
      return {
        message: "Failed to upload file",
        success: false
      }
    }

    return {
      imageUrl: url.toString(),
      fileId: result.$id.toString(),
      success: true
    };


  } catch (error) {
    return {
      message: "Failed to upload file",
      success: true
    };
  }




};



