import mongoose from "mongoose";
// import CountdownTimer from "../frontend/components/CountdownTimer";

const stickyCartSchema = new mongoose.Schema(
    {
        shop: { type: String, required: true, unique: true },

        enabled: { type: Boolean, default: false },

        // WHERE TO DISPLAY
        displayScope: {
            type: String,
            enum: ["all_products", "selected_products", "exclude_products", "collections"],
            default: "all_products",
        },

        // WHEN TO DISPLAY
        displayMode: {
            type: String,
            enum: ["always", "in_view", "out_of_view"],
            default: "always",
        },

        selectedProducts: { type: [String], default: [] },
        excludedProducts: { type: [String], default: [] },
        selectedCollections: { type: [String], default: [] },

        // BANNER SETTINGS
        banner: {
            show: { type: Boolean, default: false },
            text: { type: String, default: "" },
            backgroundColor: { type: String, default: "#ffffff" },
            textColor: { type: String, default: "#000000" },
            fontWeight: { type: String, enum: ["normal", "bold"], default: "normal" },
            fontStyle: { type: String, enum: ["normal", "italic"], default: "normal" },
            underline: { type: Boolean, default: false },
            fontSize: { type: String, default: "16px" }, // added for React mapping
            Countdown: { type: Boolean, default: false },
        },

        // PRODUCT DETAILS SECTION
        productDetails: {
            showTitle: { type: Boolean, default: true },
            showPrice: { type: Boolean, default: true },
            showVendor: { type: Boolean, default: false },
            textColor: { type: String, default: "#000000" },
            fontSize: { type: String, default: "16px" },
        },

        // VARIANT SELECTOR
        variantSelector: {
            show: { type: Boolean, default: true },
            style: { type: String, enum: ["dropdown", "buttons"], default: "dropdown" },
            backgroundColor: { type: String, default: "#ffffff" },
            textColor: { type: String, default: "#000000" },
            fontSize: { type: String, default: "14px" },
            isBold: { type: Boolean, default: false },
        },

        // QUANTITY SELECTOR
        quantitySelector: {
            show: { type: Boolean, default: true },
            backgroundColor: { type: String, default: "#ffffff" },
            textColor: { type: String, default: "#000000" },
            borderColor: { type: String, default: "#cccccc" },
        },

        // ATC (Add to Cart Button)
        addToCartButton: {
            text: { type: String, default: "Add to cart" },
            backgroundColor: { type: String, default: "#000000" },
            textColor: { type: String, default: "#ffffff" },
            borderRadius: { type: String, default: "5px" },
            showIcon: { type: Boolean, default: true },
            action: { type: String, enum: ["cart", "checkout", "stay"], default: "cart" },

            soldOutText: { type: String, default: "Sold out" }, // added for your React code
        },

        // MAIN CONTAINER
        container: {
            backgroundColor: { type: String, default: "#ffffff" },
            padding: { type: String, default: "10px" },
            position: {
                type: String,
                enum: ["bottom", "top"],
                default: "bottom",
            },
            borderRadius: { type: String, default: "8px" },
            borderSize: { type: String, default: 0 },
            borderColor: { type: String, default: "#000000" },
            shadow: { type: Boolean, default: false },
        },

        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("StickyCartConfig", stickyCartSchema);
