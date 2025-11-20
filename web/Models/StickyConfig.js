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
            enum: ["always", "scroll", "outOfView"],
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
            fontWeight: { type: Boolean, default: true },
            fontStyle: { type: Boolean, default: false },
            underline: { type: Boolean, default: false },
            fontSize: { type: String, default: "16px" }, // added for React mapping
            Countdown: { type: String, default: "hide" },
            coundownDate: { type: String, default: "" },
            fixedminute: { type: String, default: "" },
            TimerEnd: { type: String, default: "hide" }
        },

        // PRODUCT DETAILS SECTION
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

        // VARIANT SELECTOR
        variantSelector: {
            show: { type: Boolean, default: true },
            // style: { type: String, enum: ["dropdown", "buttons"], default: "dropdown" },
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
            borderRadius: { type: Number, default: 0 },
            borderSize: { type: Number, default: 0 },
            iconColor: { type: String, default: "#000000" },
            fontSize: { type: Number, default: 14 },
        },

        // ATC (Add to Cart Button)
        addToCartButton: {
            text: { type: String, default: "Add to cart" },
            backgroundColor: { type: String, default: "#000000" },
            textColor: { type: String, default: "#ffffff" },
            borderSize: { type: Number, default: 0 },
            borderColor: { type: String, default: "#000000" },
            fontSize: { type: String, default: "16px" },
            borderRadius: { type: Number, default: "5px" },
            action: { type: String, enum: ["cart", "checkout", "stay"], default: "cart" },
            soldOutText: { type: String, default: "Sold out" }, // added for your React code
            soldOutBackgroundColor: { type: String, default: "#cccccc" }, // added for your React code
            soldOutBorderSize: { type: Number, default: 0 }, // added for your React code
            soldOutBorderColor: { type: String, default: "#000000" }, // added for your React code
            soldOutBorderRadius: { type: Number, default: 0 }, // added for your React code
        },

        // MAIN CONTAINER
        container: {
            onDesktop: { type: Boolean, default: true },
            onMobile: { type: Boolean, default: true },
            backgroundColor: { type: String, default: "#ffffff" },
            CondensedValue: { type: String, default: "800" },
            position: {
                type: String,
                enum: ["bottom", "top"],
                default: "bottom",
            },
            borderSize: { type: Number, default: 0 },
            borderColor: { type: String, default: "#000000" },
            shadow: { type: Boolean, default: false },
            fontFamily: { type: String, default: "Arial, sans-serif" },
            size: {
                type: String,
                enum: ["full", "condensed"],
                default: "full",
            },
            horizontalPosition: {
                type: String,
                enum: ["left", "right"],
                default: "right",
            },
            BottomOffset: {
                type: Number,
                default: 0
            },
            TopOffset: {
                type: Number,
                default: 0
            },
            RightOffset: {
                type: Number,
                default: 0
            },
            LeftOffset: {
                type: Number,
                default: 0
            },
            Template: {
                type: String,
                enum: ["dark", "white"],
                default: "dark",
            },

        },


        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("StickyCartConfig", stickyCartSchema);
