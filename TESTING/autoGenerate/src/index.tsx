import React, { useState, useEffect } from "react";
import aiImage from "./assets/ai.png";
import { Loader } from "lucide-react";

interface DynamicField {
    label: string;
    type: string;
    name: string;
    options?: string[];
    allowCustom?: boolean;
}

const fieldsData: Record<string, DynamicField[]> = {
    Electronics: [
        { label: "RAM", type: "checkbox", name: "ram", options: ["4GB", "6GB", "12GB", "16GB", "32GB", "64GB"], allowCustom: true },
        { label: "Color", type: "checkbox", name: "color", options: ["Red", "Blue", "Black", "Green", "Purple"], allowCustom: true },
        { label: "Storage", type: "checkbox", name: "storage", options: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"], allowCustom: true }
    ],
    Fashion: [
        { label: "Material", type: "text", name: "material" },
        { label: "Gender", type: "radio", name: "gender", options: ["Male", "Female", "Unisex"] },
        { label: "Pattern", type: "text", name: "pattern" },
        { label: "Fit", type: "select", name: "fit", options: ["Slim", "Regular", "Loose"] }
    ],
    Footwear: [
        { label: "Size", type: "number", name: "size" },
        { label: "Material", type: "text", name: "material" },
        { label: "Color", type: "checkbox", name: "color", options: ["Red", "Blue", "Black"], allowCustom: true },
        { label: "Type", type: "select", name: "type", options: ["Casual", "Sports", "Formal", "Sandals"] }
    ],
    Beauty: [
        { label: "Skin Type", type: "select", name: "skinType", options: ["Oily", "Dry", "Normal", "Combination"] },
        { label: "Ingredients", type: "textarea", name: "ingredients" },
        { label: "Product Form", type: "radio", name: "productForm", options: ["Cream", "Liquid", "Powder", "Gel"] },
        { label: "Expiry Date", type: "date", name: "expiryDate" }
    ],
    Groceries: [
        { label: "Weight", type: "number", name: "weight" },
        { label: "Unit", type: "select", name: "unit", options: ["kg", "g", "l", "ml", "pack"] },
        { label: "Organic", type: "checkbox", name: "organic" },
        { label: "Brand Origin", type: "text", name: "brandOrigin" }
    ],
    Bags: [
        { label: "Material", type: "select", name: "material", options: ["Leather", "Synthetic", "Canvas", "Cloth"] },
        { label: "Size", type: "select", name: "size", options: ["Small", "Medium", "Large"] },
        { label: "Color", type: "checkbox", name: "color", options: ["Red", "Blue", "Black"], allowCustom: true },
        { label: "Type", type: "select", name: "type", options: ["Handbag", "Backpack", "Sling", "Tote"] }
    ],
    Wellness: [
        { label: "Type", type: "select", name: "type", options: ["Supplement", "Vitamin", "Herbal", "Fitness"] },
        { label: "Weight", type: "number", name: "weight" },
        { label: "Ingredients", type: "textarea", name: "ingredients" },
        { label: "Dosage Form", type: "radio", name: "dosageForm", options: ["Capsule", "Tablet", "Powder", "Liquid"] }
    ]
};

const DynamicProductForm: React.FC = () => {
    const [category, setCategory] = useState("");
    const [hintMessage, setHintMessage] = useState<string>("");
    const [generatedJsonFormat, setGenerateFormat] = useState<string | null>(null);

    const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
    const [customFields, setCustomFields] = useState<DynamicField[]>([]);
    const [formValues, setFormValues] = useState<any>({
        brand: "",
        name: "",
        typeOfProduct: "",
        discount: 0,
        actualPrice: "",
        discountedPrice: "",
        inStock: false,
        description: "",
        reviewsCount: 0,
        productImage: null,
        relatedImages: []
    });
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<string | null>(null);

    useEffect(() => {
        if (category) {
            generatePromptJsonSchema();
            setDynamicFields(fieldsData[category] || []);
        } else {
            setDynamicFields([]);
        }
    }, [category]);

    const stylesHint = {
        display: 'flex',
        gap: "5px",
        top: "100px",
        position: "absolute",
        right: "90px"
    } as React.CSSProperties;

    function generatePromptJsonSchema() {
        if (!category) return;

        const baseSchema = {
            brand: "string",
            name: "string",
            typeOfProduct: "string",
            category: category,
            discount: "number",
            actualPrice: "number",
            discountedPrice: "number",
            inStock: "boolean",
            description: "string",
            reviews: ["string"],
            additionalInfo: {}
        };

        const additionalInfoFields = fieldsData[category] || [];

        baseSchema.additionalInfo = additionalInfoFields.reduce((acc, field) => {
            if (field.type === "checkbox") {
                acc[field.name] = ["string"];
            } else {
                acc[field.name] = "string";
            }
            return acc;
        }, {} as Record<string, any>);

        console.log("Generated JSON schema prompt for AI or form:", baseSchema);
        setGenerateFormat(JSON.stringify(baseSchema));
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

        if (target instanceof HTMLInputElement) {
            const { name, value, type, checked, files } = target;
            if (type === "checkbox" && name === "inStock") {
                setFormValues({ ...formValues, [name]: checked });
                return;
            }

            if (type === "file") {
                if (files) {
                    if (name === "productImage") {
                        setFormValues({ ...formValues, [name]: files[0] });
                    } else {
                        setFormValues({ ...formValues, [name]: Array.from(files) });
                    }
                }
                return;
            }

            if (type === "checkbox" && checked) {
                const existing = formValues[name] || [];
                setFormValues({ ...formValues, [name]: [...existing, value] });
                return;
            }
            if (type === "checkbox") {
                const existing = formValues[name] || [];
                setFormValues({ ...formValues, [name]: existing.filter((v: string) => v !== value) });
                return;
            }

            setFormValues({ ...formValues, [name]: value });
            return;
        }

        if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
            const { name, value } = target as HTMLTextAreaElement | HTMLSelectElement;
            setFormValues({ ...formValues, [name]: value });
            return;
        }
    };

    const addCustomField = () => {
        const fieldName = prompt("Enter field name:");
        if (!fieldName) return;
        const fieldType = prompt("Enter field type (text, number, checkbox, radio, date, file, textarea, select):", "text");
        if (!fieldType) return;

        let newField: DynamicField = { label: fieldName, type: fieldType, name: fieldName.replace(/\s+/g, "").toLowerCase() };

        if (["checkbox", "radio", "select"].includes(fieldType)) {
            const options = prompt("Enter options separated by commas:");
            if (!options) return;
            newField.options = options.split(",").map(o => o.trim());
        }

        setCustomFields([...customFields, newField]);
    };

    // This function fills the formValues state with AI response JSON dynamically
    const fillFormValuesFromJson = (jsonResponse: any) => {
        if (!jsonResponse) return;

        let newFormValues: any = { ...formValues };

        // Top-level known keys
        const keysToFill = [
            "brand", "name", "typeOfProduct", "discount",
            "actualPrice", "discountedPrice", "inStock",
            "description", "reviews"
        ];

        keysToFill.forEach(key => {
            if (key === "reviews" && Array.isArray(jsonResponse.reviews)) {
                // Set reviewsCount from length of reviews array
                newFormValues.reviewsCount = jsonResponse.reviews.length;
            }
            else if (jsonResponse[key] !== undefined) {
                newFormValues[key] = jsonResponse[key];
            }
        });

        // Fill additionalInfo fields into form values
        if (jsonResponse.additionalInfo && typeof jsonResponse.additionalInfo === "object") {
            Object.entries(jsonResponse.additionalInfo).forEach(([key, value]) => {
                newFormValues[key] = value;
            });
        }

        setFormValues(newFormValues);
    };

    const callAI = async () => {
        if (!category) {
            alert("Please select a category");
            return;
        }
        const apiKey = "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";

        setLoading(true);
        setAiResponse(null);

        const userHint = `You are an AI that must return output **only in JSON format** with no extra text or explanation.  
The user will provide a product category and a hint (such as a partial name, keyword, or description).  
You must strictly ensure:
- The output must be valid JSON only.  
- The product must always match the given category.  
- The hint must be considered while generating the product name/details (do not invent unrelated items).  
- If no matching product could reasonably exist, return an empty JSON object { }. 

HINT ->>>> [ ${hintMessage} ]

Output JSON format:

${generatedJsonFormat}

`;

        const payload = {
            model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
            messages: [{ role: "user", content: `${userHint}` }]
        };

        try {
            const response = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            const message = data.choices?.[0]?.message?.content || "";

            let parsedJson;
            try {
                parsedJson = JSON.parse(message);
                console.log(parsedJson);
                setAiResponse(JSON.stringify(parsedJson, null, 2));

                // Auto-fill form inputs with AI JSON response
                fillFormValuesFromJson(parsedJson);

            } catch (e) {
                setAiResponse("Failed to parse AI response as JSON. Response was:\n" + message);
            }
        } catch (e) {
            setAiResponse("AI call failed: " + e);
        }
        setLoading(false);
    };

    const renderField = (field: DynamicField) => {
        const commonProps = {
            name: field.name,
            onChange: handleInputChange
        };

        if (field.type === "text" || field.type === "number" || field.type === "date") {
            return <input key={field.name} type={field.type} value={formValues[field.name] || ""} {...commonProps} />;
        } else if (field.type === "textarea") {
            return <textarea key={field.name} value={formValues[field.name] || ""} {...commonProps}></textarea>;
        } else if (field.type === "select" && field.options) {
            return (
                <select key={field.name} value={formValues[field.name] || ""} {...commonProps}>
                    {field.options.map(opt => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            );
        } else if ((field.type === "checkbox" || field.type === "radio") && field.options) {
            return (
                <div key={field.name}>
                    {field.options.map(opt => (
                        <label key={opt} style={{ marginRight: "10px" }}>
                            <input
                                type={field.type}
                                name={field.type === "checkbox" ? field.name : field.name}
                                value={opt}
                                onChange={handleInputChange}
                                checked={
                                    field.type === "checkbox"
                                        ? Array.isArray(formValues[field.name]) && formValues[field.name].includes(opt)
                                        : formValues[field.name] === opt
                                }
                            />
                            {opt}
                        </label>
                    ))}
                    {field.allowCustom && (
                        <button
                            type="button"
                            onClick={() => {
                                const newOption = prompt("Enter custom option:");
                                if (!newOption) return;
                                field.options!.push(newOption);
                                setDynamicFields([...dynamicFields]);
                            }}
                            style={{
                                marginLeft: 10,
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                padding: "2px 6px",
                                borderRadius: 4,
                                cursor: "pointer"
                            }}
                        >
                          Add Custom
                        </button>
                    )}
                </div>
            );
        }
        return null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Form submitted! Data:\n" + JSON.stringify(formValues, null, 2));
    };

    return (
        <div style={{ position: "relative", maxWidth: 900, margin: "auto", padding: 20, fontFamily: "Segoe UI, sans-serif" }}>
            <h2 style={{ textAlign: "center", marginBottom: 20, color: "#333" }}>Dynamic Product Input Form</h2>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    backgroundColor: "#fff",
                    padding: 25,
                    borderRadius: 12,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                }}
            >
                <label htmlFor="category">Category</label>
                <select name="category" value={category} onChange={e => setCategory(e.target.value)} required>
                    <option value="">Select Category</option>
                    {Object.keys(fieldsData).map(cat => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <div style={stylesHint}>
                    <input
                        value={hintMessage}
                        onChange={(e) => setHintMessage(e.target.value)}
                        type="text" placeholder="provide hint...." />
                    {
                        loading ?
                            <Loader />
                            :
                            <img onClick={callAI} style={{ cursor: "pointer" }} src={aiImage} alt="" width={40} />
                    }
                </div>

                <label>Brand</label>
                <input type="text" name="brand" value={formValues.brand} onChange={handleInputChange} required />

                <label>Product Name</label>
                <input type="text" name="name" value={formValues.name} onChange={handleInputChange} required />

                <label>Type of Product</label>
                <input type="text" name="typeOfProduct" value={formValues.typeOfProduct} onChange={handleInputChange} />

                <label>Discount (%)</label>
                <input type="number" min={0} name="discount" value={formValues.discount} onChange={handleInputChange} />

                <label>Actual Price</label>
                <input type="number" min={0} name="actualPrice" value={formValues.actualPrice} onChange={handleInputChange} required />

                <label>Discounted Price</label>
                <input type="number" min={0} name="discountedPrice" value={formValues.discountedPrice} onChange={handleInputChange} />

                <label>In Stock</label>
                <input type="checkbox" name="inStock" checked={formValues.inStock} onChange={handleInputChange} />

                <label>Description</label>
                <textarea name="description" value={formValues.description} onChange={handleInputChange} />

                <label>Reviews (Count)</label>
                <input type="number" min={0} name="reviewsCount" value={formValues.reviewsCount} onChange={handleInputChange} />

                <label>Product Image</label>
                <input type="file" name="productImage" onChange={handleInputChange} accept="image/*" />

                <label>Related Images</label>
                <input type="file" multiple name="relatedImages" onChange={handleInputChange} accept="image/*" />

                <div style={{ borderTop: "1px solid #eee", paddingTop: 15, display: "flex", flexDirection: "column", gap: 15 }}>
                    {dynamicFields.map(field => (
                        <div key={field.name}>
                            <label>{field.label}</label>
                            {renderField(field)}
                        </div>
                    ))}
                </div>

                <div style={{ borderTop: "1px solid #eee", paddingTop: 15 }}>
                    <h3>Custom Fields</h3>
                    <button
                        type="button"
                        onClick={addCustomField}
                        style={{
                            cursor: "pointer",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            padding: 10,
                            borderRadius: 6,
                            fontWeight: 600,
                            transition: "background 0.3s"
                        }}
                    >
                        Add Custom Field
                    </button>
                    {customFields.map(field => (
                        <div key={field.name} style={{ marginTop: 10 }}>
                            <label>{field.label}</label>
                            {renderField(field)}
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    style={{
                        marginTop: 10,
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        padding: 10,
                        borderRadius: 6,
                        fontWeight: 600,
                        cursor: "pointer"
                    }}
                >
                    Submit
                </button>
            </form>

            {aiResponse && (
                <div
                    style={{
                        marginTop: 20,
                        backgroundColor: "#f1f1f1",
                        padding: 15,
                        borderRadius: 6,
                        maxHeight: 300,
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                        fontFamily: 'monospace',
                        fontSize: 14
                    }}
                >
                    <h3>AI Generated Product JSON</h3>
                    <pre>{aiResponse}</pre>
                </div>
            )}
        </div>
    );
};

export default DynamicProductForm;
