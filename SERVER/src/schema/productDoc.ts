import mongoose from "mongoose";
const { Schema } = mongoose;

const BaseProductSchema = new Schema({
    brand: { type: String, required: true },
    name: { type: String, required: true },
    typeOfProduct: { type: String },
    category: { type: String, required: true },
    discount: { type: Number, default: 0 },
    actualPrice: { type: Number, required: true },
    discountedPrice: { type: Number },
    inStock: { type: Boolean, default: true },
    description: { type: String },
    rating : {type : Number},
    reviews: { type: Number, default: 0 },
    productImage: {
        type: String,
        required: true
    },
    relatedPics: [String],
    buyQuantity: { type: Number, default: 0 },
    customFields: { type: Schema.Types.Mixed },
}, { timestamps: true });


const ElectronicsSchema = new Schema({
    ...BaseProductSchema.obj,
    ram: [String],
    color: [String],
    storage: [String],
});


const FashionSchema = new Schema({
    ...BaseProductSchema.obj,
    material: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Unisex'] },
    pattern: { type: String },
    fit: { type: String, enum: ['Slim', 'Regular', 'Loose'] },
});


const FootwearSchema = new Schema({
    ...BaseProductSchema.obj,
    size: { type: Number },
    material: { type: String },
    color: [String],
    type: { type: String, enum: ['Casual', 'Sports', 'Formal', 'Sandals'] },
});


const BeautySchema = new Schema({
    ...BaseProductSchema.obj,
    skinType: { type: String, enum: ['Oily', 'Dry', 'Normal', 'Combination'] },
    ingredients: { type: String },
    productForm: { type: String, enum: ['Cream', 'Liquid', 'Powder', 'Gel'] },
    expiryDate: { type: Date },
});


const GroceriesSchema = new Schema({
    ...BaseProductSchema.obj,
    weight: { type: Number },
    unit: { type: String, enum: ['kg', 'g', 'l', 'ml', 'pack'] },
    organic: { type: Boolean, default: false },
    brandOrigin: { type: String },
});


const BagsSchema = new Schema({
    ...BaseProductSchema.obj,
    material: { type: String, enum: ['Leather', 'Synthetic', 'Canvas', 'Cloth'] },
    size: { type: String, enum: ['Small', 'Medium', 'Large'] },
    color: [String],
    type: { type: String, enum: ['Handbag', 'Backpack', 'Sling', 'Tote'] },
});


const WellnessSchema = new Schema({
    ...BaseProductSchema.obj,
    type: { type: String, enum: ['Supplement', 'Vitamin', 'Herbal', 'Fitness'] },
    weight: { type: Number },
    ingredients: { type: String },
    dosageForm: { type: String, enum: ['Capsule', 'Tablet', 'Powder', 'Liquid'] },
});


const Electronics = mongoose.model('Electronics', ElectronicsSchema);
const Fashion = mongoose.model('Fashion', FashionSchema);
const Footwear = mongoose.model('Footwear', FootwearSchema);
const Beauty = mongoose.model('Beauty', BeautySchema);
const Groceries = mongoose.model('Groceries', GroceriesSchema);
const Bags = mongoose.model('Bags', BagsSchema);
const Wellness = mongoose.model('Wellness', WellnessSchema);

export {
    Electronics,
    Fashion,
    Footwear,
    Beauty,
    Groceries,
    Bags,
    Wellness
};