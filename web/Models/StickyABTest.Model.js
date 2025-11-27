import mongoose from "mongoose";

const StickyABTestSchema = new mongoose.Schema({
    shop: { type: String, required: true },

    productId: { type: String, required: true },

    group: {
        type: String,
        enum: ["sticky_enabled", "sticky_disabled"],
        required: true
    },

    views: { type: Number, default: 0 },
    addToCart: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },

    conversionRate: { type: Number, default: 0 }, // calculated field

    date: { type: Date, default: Date.now }

}, { timestamps: true });

export default mongoose.model("StickyABTest", StickyABTestSchema);
