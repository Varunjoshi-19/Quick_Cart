import { PrismaClient } from "@prisma/client";
import { Client } from "appwrite";
import mongoose from "mongoose";
import globalConfig from "../config/index";

class DatabaseConnections {

    #prisma: PrismaClient | null;
    #appwriteClient: Client | null;

    constructor() {
        this.#prisma = null;
        this.#appwriteClient = null
    }

    getAppWriteConnection() {

        if (this.#appwriteClient != null) {
            return this.#appwriteClient;

        }

        this.#appwriteClient = new Client();

        this.#appwriteClient
            .setEndpoint(globalConfig.appwriteEndPoint)
            .setProject(globalConfig.appwriteProjectId)

        return this.#appwriteClient;
    }

    getPrismaConnection() {

        if (this.#prisma != null) {
            return this.#prisma;
        }

        this.#prisma = new PrismaClient();
        return this.#prisma;

    }


    async mongodbDatabaseConnection() {
        try {
            const connection = await mongoose.connect(process.env.MONGODB_URI!);
            if (!connection) {
                console.log('failed to connect with mongodb!')
                return;
            }
            console.log("Mongodb connected!")
        }
        catch (error) {
            console.error('MONGODB internal connection error', error);

        }


    }

}

export default new DatabaseConnections;