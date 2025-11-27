import StickyAnalytics from "../Models/StickyAnalytics.js";
import shopify from "../shopify.js";
export const createandUpdateStickyAnalytics = async (req, res) => {
    try {
        const {
            shop,
            productId,
            stickyViews = 0,
            stickyAddToCarts = 0,
            normalAddToCarts = 0,
        } = req.body;

        if (!shop || !productId) {
            return res.status(400).json({
                success: false,
                message: "shop and productId are required",
            });
        }

        const analytics = await StickyAnalytics.findOneAndUpdate(
            { shop, productId },   // match condition

            {
                $inc: {
                    stickyViews,
                    stickyAddToCarts,
                    normalAddToCarts,
                },
                $setOnInsert: {
                    shop,
                    productId,
                },
            },

            {
                new: true,
                upsert: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Sticky analytics updated successfully",
            data: analytics,
        });

    } catch (error) {
        console.error("Sticky Analytics Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateDefaultstickyAddToCarts = async (req, res) => {
    try {
        const {
            shop,
            productId,
            normalAddToCarts = 0,
        } = req.body;

        if (!shop || !productId) {
            return res.status(400).json({
                success: false,
                message: "shop and productId are required",
            });
        }

        const analytics = await StickyAnalytics.findOneAndUpdate(
            { shop, productId },   // match condition

            {
                $inc: {
                    normalAddToCarts,
                },
                $setOnInsert: {
                    shop,
                    productId,
                },
            },

            {
                new: true,
                upsert: true,
            }
        )

        return res.status(200).json({
            success: true,
            message: "Sticky analytics updated successfully",
            data: analytics,
        });

    } catch (error) {
        console.error("Sticky Analytics Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
export const updatestickyAddToCarts = async (req, res) => {
    try {
        const {
            shop,
            productId,
            stickyAddToCarts = 0,
        } = req.body;

        if (!shop || !productId) {
            return res.status(400).json({
                success: false,
                message: "shop and productId are required",
            });
        }

        const analytics = await StickyAnalytics.findOneAndUpdate(
            { shop, productId },   // match condition

            {
                $inc: {
                    stickyAddToCarts,
                },
                $setOnInsert: {
                    shop,
                    productId,
                },
            },

            {
                new: true,
                upsert: true,
            }
        )

        return res.status(200).json({
            success: true,
            message: "Sticky analytics updated successfully",
            data: analytics,
        });

    } catch (error) {
        console.error("Sticky Analytics Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
export const getAnalytics = async (req, res) => {
    try {
        const { shop } = req.params;

        // 1. Get all analytics for this shop
        const analytics = await StickyAnalytics.find({ shop });

        // 2. Create GraphQL client
        const client = new shopify.api.clients.Graphql({
            session: res.locals.shopify.session, // make sure sessions contains the active session!
        });

        // GraphQL Query
        const query = `
            query ProductInfo($ownerId: ID!) {
                product(id: $ownerId) {
                    id
                    title
                    variants(first:150){
                        edges{
                            node{
                                id
                                title
                                compareAtPrice
                                availableForSale
                                price
                                media(first:10) {
                                    edges {
                                        node {
                                            preview {
                                                image {
                                                    url
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    media(first:1) {
                        edges {
                            node {
                                preview {
                                    image {
                                        url
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        // 3. Loop all analytics → run GraphQL → merge results
        const detailedAnalytics = await Promise.all(
            analytics.map(async (item) => {
                const ownerId = `gid://shopify/Product/${item.productId}`;

                const response = await client.query({
                    data: {
                        query,
                        variables: { ownerId },
                    },
                });

                const product = response?.body?.data?.product || null;

                // Return merged result
                return {
                    ...item._doc,      // original analytics data
                    productData: product // new GraphQL product data
                };
            })
        );

        // 4. Send response
        return res.status(200).json({
            success: true,
            message: "Sticky analytics fetched successfully",
            data: detailedAnalytics,
        });

    } catch (error) {
        console.error("Sticky Analytics Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
