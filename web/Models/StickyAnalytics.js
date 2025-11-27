import mongoose from "mongoose";

const StickyAnalyticsSchema = new mongoose.Schema({
    shop: { type: String, required: true, index: true },
    productId: { type: String, required: true },

    stickyViews: { type: Number, default: 0 },
    stickyAddToCarts: { type: Number, default: 0 },
    normalAddToCarts: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now }

}, { timestamps: true });

export default mongoose.model("StickyAnalytics", StickyAnalyticsSchema);
