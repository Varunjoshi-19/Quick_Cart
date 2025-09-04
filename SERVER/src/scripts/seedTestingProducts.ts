import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";
import dbConnect from "../database/connection";
import { Beauty, Wellness, Groceries } from "../schema/productDoc";
import { handleUploadFile } from "../utils";
import globalConfig from "../config";

type CategoryKey = "beauty" | "wellness" | "grocery";

const categoryToModel = {
    beauty: Beauty,
    wellness: Wellness,
    grocery: Groceries,
} as const;

async function ensureMongo() {
    dotenv.config();
    await dbConnect.mongodbDatabaseConnection();
}

function repoRoot() {
    // Assume running from SERVER dir; repo root is parent of SERVER
    return path.resolve(process.cwd(), "..");

}

function testingDirFor(category: CategoryKey) {
    return path.join(repoRoot(), "TESTING", category);
}

// cache for names extracted from TESTING/reference.js
let referenceNameCache: { beautyNames: string[]; groceryNames: string[]; wellnessNames: string[] } | null = null;

async function loadReferenceNames() {
    try {
        const refPath = path.join(repoRoot(), "TESTING", "reference.js");
        const content = await fs.readFile(refPath, "utf-8");

        function extract(blockStart: string) {
            const startIdx = content.indexOf(blockStart);
            if (startIdx === -1) return [] as string[];
            const endIdx = content.indexOf("];", startIdx);
            const slice = content.slice(startIdx, endIdx === -1 ? undefined : endIdx);
            const regex = /productName\s*:\s*"([^"]+)"/g;
            const names: string[] = [];
            let m: RegExpExecArray | null;
            while ((m = regex.exec(slice))) {
                if (m && typeof m[1] === "string") names.push(m[1]);
            }
            return names;
        }

        const beautyNames = extract("export const allBeauty");
        const groceryNames = extract("const groceryProducts");
        const wellnessNames = extract("const wellnessProducts");
        return { beautyNames, groceryNames, wellnessNames };
    } catch {
        return { beautyNames: [], groceryNames: [], wellnessNames: [] };
    }
}

function randomFrom<T>(arr: T[]): T {
    if (!arr.length) {
        throw new Error("randomFrom received empty array");
    }
    return arr[Math.floor(Math.random() * arr.length)] as T;
}

function pickBrand(category: CategoryKey, fileName: string) {
    const lower = fileName.toLowerCase();
    const beautyBrands = ["Olay", "L'Oréal", "Vaseline", "Nivea", "Lakmé", "Maybelline", "Mamaearth", "Wow Skin Science", "Garnier", "Dr Batra's"];
    const groceryBrands = ["Fortune", "Gemini", "Saffola", "Catch", "Tide", "Zandu", "Aashirvaad", "Britannia", "Nestlé", "Amul"];
    const wellnessBrands = ["HealthKart", "Himalaya", "Protinex", "Ensure", "Pro360", "GNC", "MuscleBlaze", "Fast&Up", "Kapiva", "Dabur"];

    const hints: Array<[string, string[]]> = [
        ["olay", ["Olay"]],
        ["vaseline", ["Vaseline"]],
        ["tide", ["Tide"]],
        ["fortune", ["Fortune"]],
        ["gemini", ["Gemini"]],
        ["saffola", ["Saffola"]],
        ["protinex", ["Protinex"]],
        ["ensure", ["Ensure"]],
        ["kapiva", ["Kapiva"]],
    ];
    for (const [key, vals] of hints) {
        if (lower.includes(key)) return vals[0];
    }

    switch (category) {
        case "beauty": return randomFrom(beautyBrands);
        case "grocery": return randomFrom(groceryBrands);
        case "wellness": return randomFrom(wellnessBrands);
    }
}

function pickName(category: CategoryKey, brand: string, fileName: string) {
    const lower = fileName.toLowerCase();
    const beautyNames = [
        "Total Effects Day Cream SPF 15",
        "Natural Cleansing Milk",
        "Rose Water",
        "HD 2-in-1 Foundation",
        "Creme Hair Color",
        "Original Care Lip Therapy",
        "Ocean Face Wash",
        "Hydrating Face Cream",
    ];
    const groceryNames = [
        "Refined Sunflower Oil",
        "Liquid Detergent",
        "Detergent Powder - Lemon Fresh",
        "Besan Flour",
        "Edible Oil",
        "Amla Hair Oil",
        "Potato Chips - Classic Salted",
        "Chakki Fresh Atta",
    ];
    const wellnessNames = [
        "Apple Cider Vinegar Capsules",
        "Detox Powder",
        "Super Greens",
        "Super Reds",
        "Nutritional Drink",
        "Air Freshener - Lavender",
        "Nutritional Powder",
    ];

    // filename hints
    const hints: Array<[string, string]> = [
        ["oil", "Refined Sunflower Oil"],
        ["atta", "Chakki Fresh Atta"],
        ["chips", "Potato Chips - Classic Salted"],
        ["detergent", "Liquid Detergent"],
        ["rose", "Rose Water"],
        ["cream", "Hydrating Face Cream"],
        ["wash", "Ocean Face Wash"],
        ["powder", "Detox Powder"],
        ["capsule", "Apple Cider Vinegar Capsules"],
        ["flour", "Besan Flour"],
    ];
    for (const [key, value] of hints) {
        if (lower.includes(key)) return `${brand} ${value}`.trim();
    }

    // prefer names from reference cache if available
    const ref = referenceNameCache;
    const poolFromRef = category === "beauty" ? ref?.beautyNames : category === "grocery" ? ref?.groceryNames : ref?.wellnessNames;
    const pool = (poolFromRef && poolFromRef.length ? poolFromRef : (category === "beauty" ? beautyNames : category === "grocery" ? groceryNames : wellnessNames));
    return `${brand} ${randomFrom(pool)}`.trim();
}

function generateDescription(category: CategoryKey): string {
    const common: string[] = [
        "crafted for daily use",
        "premium quality ingredients",
        "backed by trusted brand standards",
        "ideal for home and travel",
        "designed to deliver consistent results",
        "easy to use and store",
        "made to fit modern lifestyles",
        "reliable performance in every use",
        "carefully tested for quality",
        "smart choice for your routine",
        "perfect balance of value and performance",
        "thoughtfully packaged for convenience",
        "supports your everyday essentials",
        "helps simplify busy schedules",
        "a dependable addition to your shelf",
        "made with attention to detail",
        "popular pick among customers",
        "meets high safety standards",
        "suited for most users",
        "balanced price and quality"
    ];
    const beauty: string[] = [
        "nourishes skin with gentle care",
        "lightweight texture absorbs quickly",
        "helps keep skin soft and hydrated",
        "enriched with soothing botanicals",
        "works well under makeup",
        "helps refresh dull-looking skin",
        "suitable for most skin types",
    ];
    const grocery: string[] = [
        "great taste in every serving",
        "sourced from trusted suppliers",
        "ideal for everyday cooking",
        "consistent texture and flavor",
        "packed for long-lasting freshness",
        "pairs well with common recipes",
    ];
    const wellness: string[] = [
        "supports active lifestyle",
        "designed to aid daily nutrition",
        "easy to mix and consume",
        "formulated for better absorption",
        "helps maintain energy through the day",
        "crafted for mindful routines",
    ];
    const bucket = category === "beauty" ? beauty : category === "grocery" ? grocery : wellness;
    const pieces = [
        `This ${category} product`,
        randomFrom(bucket),
        randomFrom(common),
        randomFrom(bucket),
        randomFrom(common),
        randomFrom(bucket),
    ];
    // create ~20-30 words description
    return pieces.join(". ") + ".";
}

function generateProductDoc(category: CategoryKey, fileName: string) {
    const nameBase = path.parse(fileName).name.replace(/[-_]/g, " ").trim();
    const brand = pickBrand(category, fileName) || "Generic";
    const realPrice = Math.floor(120 + Math.random() * 1500);
    const discountPrice = Math.max(50, Math.floor(realPrice * (0.6 + Math.random() * 0.3))); // 60%-90%
    const actualPrice = realPrice; // schema field
    const discountedPrice = discountPrice; // schema field
    const discount = Math.max(0, Math.min(80, Math.round((1 - discountedPrice / actualPrice) * 100)));
    const rating = randomFrom([3, 4, 5]);

    const categoryLabel = category === "beauty" ? "BEAUTY" : category === "grocery" ? "GROCERIES" : "WELLNESS";

    const finalName = pickName(category, brand, fileName);

    return {
        // schema per productDoc.ts
        brand,
        name: finalName || nameBase || `${brand} ${categoryLabel}`,
        typeOfProduct: categoryLabel,
        category: categoryLabel,
        discount,
        actualPrice,
        discountedPrice,
        inStock: true,
        description: generateDescription(category),
        rating,
        reviews: Math.floor(Math.random() * 200),
        productImage: "",
        relatedPics: [],
        buyQuantity: 0,
        customFields: {},
    };
}

async function seedCategory(category: CategoryKey) {
    const dir = testingDirFor(category);
    const Model = categoryToModel[category] as any;

    try {
        // load reference names once (cached in memory)
        if (!referenceNameCache) {
            referenceNameCache = await loadReferenceNames();
        }
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const files = entries.filter(e => e.isFile()).map(e => e.name);
        for (const file of files) {
            const doc = generateProductDoc(category, file);

            // idempotent-ish: avoid duplicates by name + category
            const exists = await Model.findOne({ name: doc.name, category: doc.category }).lean();
            if (exists) {
                continue;
            }
            // Upload image to Appwrite Storage
            const absolutePath = path.join(dir, file);
            const buffer = await fs.readFile(absolutePath);
            const ext = path.extname(file).toLowerCase();
            const mimetype = ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "application/octet-stream";

            const pseudoMulterFile: any = {
                buffer,
                mimetype,
                originalname: file,
            };

            const upload = await handleUploadFile(pseudoMulterFile, globalConfig.quickCartBucketId);
            if (!upload.success || !upload.imageUrl) {
                console.warn(`Upload failed for ${file}, skipping`);
                continue;
            }

            doc.productImage = upload.imageUrl;

            await Model.create(doc);
            // small delay to avoid overloading
            await new Promise(r => setTimeout(r, 25));
        }
        console.log(`Seeded ${category}: ${files.length} files processed.`);
    } catch (err) {
        console.error(`Failed to seed ${category}:`, err);
    }
}

async function main() {
    await ensureMongo();
    await seedCategory("beauty");
    await seedCategory("wellness");
    await seedCategory("grocery");
    process.exit(0);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});


