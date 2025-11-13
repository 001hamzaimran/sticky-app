import StickyConfig from "../Models/StickyConfig.js";



export const getStickyCartSettings = async (req, res) => {
    try {
        const { shop } = req.params;

        const config = await StickyConfig.findOne({ shop });

        if (!config) {
            return res.status(404).json({
                success: false,
                message: "Sticky cart settings not found for this shop",
            });
        }

        res.status(200).json({
            success: true,
            message: "Sticky cart settings fetched successfully",
            data: config,
        });
    } catch (error) {
        console.error("Error fetching sticky cart settings:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const createOrUpdateStickyCart = async (req, res) => {
    try {
        const {
            shop,
            enabled,
            displayScope,
            selectedProducts,
            excludedProducts,
            selectedCollections,
            banner,
            productDetails,
            variantSelector,
            quantitySelector,
            addToCartButton,
            container,
        } = req.body;

        if (!shop) {
            return res.status(400).json({
                success: false,
                message: "Shop is required",
            });
        }

        let config = await StickyConfig.findOne({ shop });

        if (config) {
            // Update existing settings
            config.set({
                enabled,
                displayScope,
                selectedProducts,
                excludedProducts,
                selectedCollections,
                banner,
                productDetails,
                variantSelector,
                quantitySelector,
                addToCartButton,
                container,
                updatedAt: new Date(),
            });
            await config.save();

            return res.status(200).json({
                success: true,
                message: "Sticky cart settings updated successfully",
                data: config,
            });
        }

        // Create new settings
        const newConfig = await StickyConfig.create({
            shop,
            enabled,
            displayScope,
            selectedProducts,
            excludedProducts,
            selectedCollections,
            banner,
            productDetails,
            variantSelector,
            quantitySelector,
            addToCartButton,
            container,
        });

        res.status(201).json({
            success: true,
            message: "Sticky cart settings created successfully",
            data: newConfig,
        });
    } catch (error) {
        console.error("Error saving sticky cart settings:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
