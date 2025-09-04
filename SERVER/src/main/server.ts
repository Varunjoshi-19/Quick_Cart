import express from "express";
import dotenv from "dotenv";
import userRoute from "../routes/userRoute"
import productRoute from "../routes/productRoute";
import otherRoute from "../routes/other";
import cartRoute from "../routes/cartRoute";
import dbConnect from "../database/connection";
import cors from "cors";

async function startServer() {

    dotenv.config();

    const app = express();
    const PORT = process.env.PORT || 4000;

    await dbConnect.mongodbDatabaseConnection();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors({
        origin: process.env.ALLOWED_ORIGIN!,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }));


    app.use("/api", otherRoute);
    app.use("/user", userRoute);
    app.use("/products", productRoute);
    app.use("/cart", cartRoute);


    app.listen(PORT, () => {
        console.log('server running on port 4000');


    })


}


startServer();