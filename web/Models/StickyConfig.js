import mongoose from "mongoose";

const stickyCartSchema = new mongoose.Schema({
    shop: {
        type: String,
        required: true,
    },

    // Display control
    enabled: {
        type: Boolean,
        default: true,
    },
    displayScope: {
        display: { type: String, enum: ["always", "in_view", "out_of_view"], default: "always" },
        type: String,
        enum: ["all_products", "selected_products", "exclude_products", "collections"],
        default: "all_products",
    },
    selectedProducts: [String], // array of product IDs
    excludedProducts: [String],
    selectedCollections: [String],

    // Banner customization
    banner: {
        show: { type: Boolean, default: true },
        text: { type: String, default: "Get it while it lasts" },
        backgroundColor: { type: String, default: "#00FFC2" },
        textColor: { type: String, default: "#000000" },
        fontWeight: { type: String, enum: ["normal", "bold"], default: "normal" },
        fontStyle: { type: String, enum: ["normal", "italic"], default: "normal" },
        underline: { type: Boolean, default: false },
    },

    // Product details section
    productDetails: {
        showTitle: { type: Boolean, default: true },
        titleBold: { type: Boolean, default: true },
        titleColor: { type: String, default: "#FFFFFF" },
        titleSize: { type: Number, default: 16 },

        showPrice: { type: Boolean, default: true },
        priceColor: { type: String, default: "#FFFFFF" },
        priceSize: { type: Number, default: 14 },
        priceBold: { type: Boolean, default: false },

        showComparePrice: { type: Boolean, default: false },
        comparePriceColor: { type: String, default: "#CCCCCC" },
        comparePriceSize: { type: Number, default: 14 },
        comparePriceBold: { type: Boolean, default: false },

        showImage: { type: Boolean, default: true },
    },

    // Variant selector
    variantSelector: {
        show: { type: Boolean, default: true },
        textColor: { type: String, default: "#000000" },
        isBold: { type: Boolean, default: false },
        fontSize: { type: Number, default: 14 },
        backgroundColor: { type: String, default: "#FFFFFF" },


    },

    // Quantity selector
    quantitySelector: {
        show: { type: Boolean, default: true },
        textColor: { type: String, default: "#000000" },
        isBold: { type: Boolean, default: false },
        fontSize: { type: Number, default: 14 },
        borderColor: { type: String, default: "#CCCCCC" },
        borderWidth: { type: Number, default: 1 },
        backgroundColor: { type: String, default: "#FFFFFF" },
        iconColor: { type: String, default: "#000000" },
        IconSize: { type: Number, default: 12 },
        iconBackgroundColor: { type: String, default: "#EEEEEE" },
    },

    // Add to cart button
    addToCartButton: {
        text: { type: String, default: "Add to Cart" },
        backgroundColor: { type: String, default: "#000000" },
        textColor: { type: String, default: "#FFFFFF" },
        action: { type: String, enum: ["cart", "checkout", "stay"], default: "cart" },
        fontWeight: { type: String, enum: ["normal", "bold"], default: "bold" },
        fontSize: { type: Number, default: 16 },
        borderRadius: { type: Number, default: 4 },
        borderColor: { type: String, default: "#000000" },
        borderWidth: { type: Number, default: 0 },
    },

    // General layout/styling
    container: {
        backgroundColor: { type: String, default: "#000000" },
        borderRadius: { type: Number, default: 8 },
        shadow: { type: Boolean, default: true },
        position: {
            type: String,
            enum: ["top", "bottom"],
            default: "bottom",
        },
    },

    // Date tracking
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

stickyCartSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.model("StickyCartConfig", stickyCartSchema);
