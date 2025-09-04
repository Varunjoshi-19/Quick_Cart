import type { Request, Response } from "express";
import { Electronics, Fashion, Footwear, Bags, Beauty, Groceries, Wellness } from "../schema/productDoc";
import { handleUploadFile } from "../utils";
import globalConfig from "../config/index";
class ProductServices {


    async AddNewProduct(req: Request, res: Response) {

        try {
            let data: any = req.body;
            data.inStock = data.inStock == "on" ? true : false;

            if (!data.category) return res.status(400).json({ message: 'Category is required' });

            let Model;

            switch (data.category) {
                case 'Electronics': Model = Electronics; break;
                case 'Fashion': Model = Fashion; break;
                case 'Footwear': Model = Footwear; break;
                case 'Beauty': Model = Beauty; break;
                case 'Groceries': Model = Groceries; break;
                case 'Bags': Model = Bags; break;
                case 'Wellness': Model = Wellness; break;
                default: return res.status(400).json({ message: 'Invalid category' });
            }

            if (req.files && !Array.isArray(req.files) && req.files['productImage']?.[0]) {
                const mainImage = req.files['productImage'][0];
                const result = await handleUploadFile(mainImage, globalConfig.quickCartBucketId);
                if (result.success) data.productImage = result.imageUrl;
            }

            if (req.files && !Array.isArray(req.files) && req.files['relatedPics']) {
                const relatedFiles = req.files['relatedPics'] as Express.Multer.File[];

                const uploadPromises = relatedFiles.map(file => handleUploadFile(file, globalConfig.quickCartBucketId));
                const results = await Promise.all(uploadPromises);

                data.relatedPics = results.filter(r => r.success).map(r => r.imageUrl);
            }


            const product = new Model(data);
            await product.save();

            res.status(201).json({ message: 'Product saved successfully' });
            return;
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }

    async FetchProducts(req: Request, res: Response) {


        let allProducts: any[] = [];

        try {
            const electronicProducts = await Electronics.find().lean();
            const bagProducts = await Bags.find().lean();
            const footwearProducts = await Footwear.find().lean();
            const fashionProducts = await Fashion.find().lean();
            const beautyProducts = await Beauty.find().lean();
            const groceriesProducts = await Groceries.find().lean();
            const wellnessProducts = await Wellness.find().lean();

            allProducts = [
                ...electronicProducts,
                ...footwearProducts,
                ...bagProducts,
                ...fashionProducts,
                ...beautyProducts,
                ...groceriesProducts,
                ...wellnessProducts,
            ];

            // Fisher–Yates shuffle
            for (let i = allProducts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
            }

            return res.status(202).json(allProducts);

        }
        catch (error) {
            return res.status(505).json({ error: error });
        }
    }

    async SingleCategoryProduct(req: Request, res: Response) {
        const category = req.params.category?.toString().toUpperCase();

        let Model;
        switch (category) {
            case "ELECTRONICS":
                Model = Electronics;
                break;
            case "FASHION":
                Model = Fashion;
                break;
            case "FOOTWEAR":
                Model = Footwear;
                break;
            case "BAGS":
                Model = Bags;
                break;
            case "BEAUTY":
                Model = Beauty;
                break;
            case "GROCERIES":
                Model = Groceries;
                break;
            case "WELLNESS":
                Model = Wellness;
                break;
            default:
                return res.status(400).json({ error: "Invalid category" });
        }

        try {
            const singleCatProduct = await (Model as any).find();
            return res.status(200).json(singleCatProduct);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Something went wrong" });
        }
    }
}


export default new ProductServices;