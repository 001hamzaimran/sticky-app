import shopify from "../shopify.js";

const getExtensionStatus = async (req, res) => {
    try {
        const session = res.locals.shopify?.session || req.session;

        if (!session?.accessToken) {
            return res.status(401).json({
                success: false,
                message: "No active session",
                enabled: false
            });
        }

        console.log("Checking extension status for shop:", session.shop);

        const client = new shopify.api.clients.Rest({ session });

        // Get all themes
        const themesRes = await client.get({
            path: "themes"
        });

        const liveTheme = themesRes.body.themes.find((t) => t.role === "main");

        if (!liveTheme) {
            return res.status(404).json({
                success: false,
                message: "No live theme found",
                enabled: false
            });
        }

        console.log("Found live theme:", liveTheme.id);

        // Fetch settings_data.json
        const assetRes = await client.get({
            path: `themes/${liveTheme.id}/assets`,
            query: {
                "asset[key]": "config/settings_data.json"
            },
        });

        const settings = JSON.parse(assetRes.body.asset.value);

        // DEBUG: Check sections and blocks structure
        console.log("=== CHECKING SECTIONS AND BLOCKS ===");
        console.log("Sections keys:", settings.current?.sections ? Object.keys(settings.current.sections) : 'No sections');
        console.log("Blocks keys:", settings.current?.blocks ? Object.keys(settings.current.blocks) : 'No blocks');

        let isEnabled = false;
        let foundLocation = null;
        let foundDetails = null;

        // Check sections for app blocks
        // Check sections for app blocks
        if (settings.current?.sections) {
            for (const [sectionName, sectionData] of Object.entries(settings.current.sections)) {
                console.log(`Checking section: ${sectionName}`);

                // Check if this section contains our app block
                if (sectionData.blocks) {
                    for (const [blockId, blockData] of Object.entries(sectionData.blocks)) {
                        console.log(`  Checking block: ${blockId}`, blockData);

                        // Look for app block references
                        const isAppBlock = (
                            blockData.type && blockData.type.includes('app_block') ||
                            blockId.includes('sticky') ||
                            (blockData.type && blockData.type.includes('sticky'))
                        );

                        if (isAppBlock) {
                            // Check the disabled state
                            if (blockData.disabled === true) {
                                console.log(`Found but DISABLED block in section:`, { sectionName, blockId });
                                // Continue searching for an ENABLED instance
                                continue;
                            } else {
                                isEnabled = true;
                                foundLocation = `sections.${sectionName}.blocks.${blockId}`;
                                foundDetails = blockData;
                                console.log(`✅ Found ENABLED app block in section:`, { sectionName, blockId });
                                break;
                            }
                        }
                    }
                }

                if (isEnabled) break;

                // Also check if the section itself is our app block
                if (sectionName.includes('sticky') ||
                    (sectionData.type && sectionData.type.includes('app_block'))) {
                    // Check disabled state for sections too
                    if (sectionData.disabled === true) {
                        console.log(`Found but DISABLED app section:`, { sectionName });
                        continue;
                    } else {
                        isEnabled = true;
                        foundLocation = `sections.${sectionName}`;
                        foundDetails = sectionData;
                        console.log(`✅ Found ENABLED app section:`, { sectionName });
                        break;
                    }
                }
            }
        }

        // Check global blocks
        if (!isEnabled && settings.current?.blocks) {
            for (const [blockId, blockData] of Object.entries(settings.current.blocks)) {
                console.log(`Checking global block: ${blockId}`, blockData);

                const isAppBlock = (
                    blockId.includes('sticky') ||
                    (blockData.type && blockData.type.includes('app_block')) ||
                    (blockData.type && blockData.type.includes('sticky'))
                );

                if (isAppBlock) {
                    // Check disabled state
                    if (blockData.disabled === true) {
                        console.log(`Found but DISABLED global block:`, { blockId });
                        continue;
                    } else {
                        isEnabled = true;
                        foundLocation = `blocks.${blockId}`;
                        foundDetails = blockData;
                        console.log(`✅ Found ENABLED app block in global blocks:`, { blockId });
                        break;
                    }
                }
            }
        }

        // Alternative: Check specific product sections
        if (!isEnabled) {
            const productSections = [
                'main-product',
                'product-template',
                'product'
            ];

            for (const sectionName of productSections) {
                if (settings.current?.sections?.[sectionName]) {
                    const section = settings.current.sections[sectionName];
                    console.log(`Checking product section ${sectionName}:`, section);

                    if (section.blocks) {
                        for (const [blockId, blockData] of Object.entries(section.blocks)) {
                            const isAppBlock = (
                                blockId.includes('sticky') ||
                                (blockData.type && blockData.type.includes('app_block'))
                            );

                            if (isAppBlock) {
                                // Check disabled state
                                if (blockData.disabled === true) {
                                    console.log(`Found but DISABLED block in product section:`, { sectionName, blockId });
                                    continue;
                                } else {
                                    isEnabled = true;
                                    foundLocation = `sections.${sectionName}.blocks.${blockId}`;
                                    foundDetails = blockData;
                                    console.log(`✅ Found ENABLED app block in product section:`, { sectionName, blockId });
                                    break;
                                }
                            }
                        }
                    }
                }
                if (isEnabled) break;
            }
        }

        console.log("Final extension status:", {
            isEnabled,
            foundLocation,
            foundDetails
        });

        return res.status(200).json({
            success: true,
            enabled: isEnabled,
            foundLocation: foundLocation,
            foundDetails: foundDetails
        });

    } catch (error) {
        console.error("Error fetching extension status:", error);

        if (error.response) {
            console.error("Shopify API Response:", {
                status: error.response.status,
                statusText: error.response.statusText,
                body: error.response.body
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
            enabled: false
        });
    }
};

export { getExtensionStatus };