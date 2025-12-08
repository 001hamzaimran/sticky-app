const createandUpdateStickyAnalytics = async (shop, body) => {
    try {
        const response = await fetch(`https://${shop}/apps/Sticky/create-analytics`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log("Analytics data:", data);

        return data;
    } catch (error) {
        console.error("Error fetching analytics data:", error);
    }
}

const updatstickyAddToCarts = async (shop, body) => {
    try {
        const response = await fetch(`https://${shop}/apps/Sticky/update-addToCartsSticky`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log("Analytics data:", data);

        return data;
    } catch (error) {
        console.error("Error fetching analytics data:", error);
    }
}
const updatedefaultstickyAddToCarts = async (shop, body) => {
    try {
        const response = await fetch(`https://${shop}/apps/Sticky/update-defaultaddToCartsSticky`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log("Analytics data:", data);

        return data;
    } catch (error) {
        console.error("Error fetching analytics data:", error);
    }
}

window.addEventListener("load", () => {
    window.lastDefaultATC = 0;

    // Detect native PRODUCT FORM submission
    // const productForms = document.querySelectorAll('form[action="/cart/add"], form[action="/cart/add.js"]');

    // productForms.forEach(form => {
    //     form.addEventListener("submit", async (e) => {
    //         // Allow the form to submit normally (we DON’T prevent)
    //         const formData = new FormData(form);
    //         const variantId = formData.get("id");

    //         if (variantId) {
    //             console.log("🛒 Default Add to Cart detected (Form)", variantId);

    //             await updatedefaultstickyAddToCarts(window.stickyCart.shop, {
    //                 shop: window.stickyCart.shop,
    //                 productId: window.stickyCart.id,
    //                 normalAddToCarts: 1
    //             });
    //         }
    //     });
});

// Detect AJAX-based Add to Cart (theme.js, global.js, custom scripts)
const originalFetch = window.fetch;
window.fetch = async function () {
    const url = arguments[0];

    if (window.isStickyCartATC) {
        window.isStickyCartATC = false;
        return originalFetch.apply(this, arguments);
    }

    if (typeof url === "string" && url.includes("/cart/add.js")) {
        return originalFetch.apply(this, arguments);
    }

    if (typeof url === "string" && url.includes("/cart/add")) {

        const now = Date.now();
        if (now - window.lastDefaultATC < 300) return originalFetch.apply(this, arguments);
        window.lastDefaultATC = now;

        console.log("🛒 Default Add to Cart detected (AJAX)");

        await updatedefaultstickyAddToCarts(window.stickyCart.shop, {
            shop: window.stickyCart.shop,
            productId: window.stickyCart.id,
            normalAddToCarts: 1
        });
    }

    return originalFetch.apply(this, arguments);
};

// window.fetch = async function () {
//     const url = arguments[0];

//     // 1️⃣ Skip if sticky cart made the request
//     if (window.isStickyCartATC) {
//         window.isStickyCartATC = false;
//         return originalFetch.apply(this, arguments);
//     }

//     // 2️⃣ Skip sticky-cart-specific add endpoint `/cart/add.js`
//     if (typeof url === "string" && url.includes("/cart/add.js")) {
//         // do NOT count as default add-to-cart
//         return originalFetch.apply(this, arguments);
//     }

//     // 3️⃣ Detect only REAL default add-to-cart
//     if (typeof url === "string" && url.includes("/cart/add")) {

//         const now = Date.now();

//         // 🛑 Prevent double firing within 500ms
//         if (now - window.lastDefaultATC < 5) {
//             return originalFetch.apply(this, arguments);
//         }

//         window.lastDefaultATC = now;

//         console.log("🛒 Default Add to Cart detected (AJAX)");

//         await updatedefaultstickyAddToCarts(window.stickyCart.shop, {
//             shop: window.stickyCart.shop,
//             productId: window.stickyCart.id,
//             normalAddToCarts: 1
//         });
//     }


//     return originalFetch.apply(this, arguments);
// };

// });

window.addEventListener('DOMContentLoaded', () => {
    const plusbtn = document.getElementById('plus');
    const minusbtn = document.getElementById('minus');
    const qtyInp = document.getElementById('qtyInp');
    const parent = document.getElementById('parent');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const variantsContainer = document.getElementById('variantsContainer');
    const topText = document.querySelector('.top-text');
    const topTextP = topText.querySelector('p');
    const topDate = topText.querySelector('h3');
    const productTitle = document.getElementById('productTitle');
    const productPrice = document.getElementById('productPrice');
    const productComparePrice = document.getElementById('productComparePrice');
    const productImg = document.getElementById('productImg');
    const productInfo = document.getElementById('productInfo');
    const variantSelect = document.getElementById('variantsItem');
    const qtyContainer = document.querySelector('.qty-container');
    let variantId;
    let countdownInterval;
    let currentVariantAvailable = true;
    let productData;
    let stickyCartSettings = null; // Store settings globally
    let stickyCartViewCount = 0;

    // ✅ Check device type
    function isMobileDevice() {
        return window.innerWidth <= 768;
    }

    // ✅ Check if sticky cart should be displayed based on device settings
    function shouldDisplayStickyCart(containerSettings) {
        const { onMobile, onDesktop } = containerSettings;

        if (onMobile && onDesktop) {
            return true;
        } else if (isMobileDevice() && onMobile) {
            return true;
        } else if (!isMobileDevice() && onDesktop) {
            return true;
        }
        return false;
    }

    // ✅ Check if product should be displayed based on display scope
    function shouldDisplayProduct(settings) {
        const { displayScope, selectedProducts, excludedProducts } = settings;

        if (!displayScope || displayScope === "all_products") {
            return true;
        }

        const { id: currentProductId } = window.stickyCart;

        if (displayScope === "selected_products") {
            return selectedProducts && selectedProducts.includes(currentProductId);
        }

        if (displayScope === "excluded_products") {
            return !excludedProducts || !excludedProducts.includes(currentProductId);
        }

        return true;
    }

    // ✅ Quantity controls
    plusbtn.addEventListener('click', () => qtyInp.value++);
    minusbtn.addEventListener('click', () => {
        if (qtyInp.value > 1) qtyInp.value--;
    });

    // ✅ Add to Cart
    addToCartBtn.addEventListener('click', async () => {
        if (!variantId) {
            alert("Please select a variant before adding to cart.");
            return;
        }

        if (!currentVariantAvailable) {
            alert("This product is currently out of stock.");
            return;
        }

        window.isStickyCartATC = true;
        const splitvariantId = variantId.split("/").pop();

        await updatstickyAddToCarts(window.stickyCart.shop, {
            shop: window.stickyCart.shop,
            productId: window.stickyCart.id,
            stickyAddToCarts: 1
        });

        fetch("/cart/add.js", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: splitvariantId, quantity: Number(qtyInp.value) || 1 })
        })
            .then(res => {
                if (!res.ok) throw new Error("Add to cart failed");
                return res.json();
            })
            .then(() => {
                const action = window.stickyCartAction || "cart";
                if (action === "cart") {
                    window.location.href = "/cart";
                } else if (action === "checkout") {
                    window.location.href = "/checkout";
                } else {
                    addToCartBtn.textContent = "Added!";
                    setTimeout(() => {
                        if (currentVariantAvailable) {
                            addToCartBtn.textContent = window.stickyCartButtonText || "Add to Cart";
                        } else {
                            addToCartBtn.textContent = window.stickyCartSoldOutText || "Sold Out";
                        }
                    }, 1500);
                }
            })
            .catch(err => {
                console.error("Add to Cart Error:", err);
                alert("Something went wrong while adding the product to the cart.");
            });
    });

    // ✅ Update button styling based on availability
    function updateAddToCartButton(addToCartButton) {
        console.log('Updating button. Available:', currentVariantAvailable); // Debug log

        if (currentVariantAvailable) {
            // Available product styling
            addToCartBtn.style.backgroundColor = addToCartButton.backgroundColor;
            addToCartBtn.style.color = addToCartButton.textColor || "#ffffff";
            addToCartBtn.style.border = `${addToCartButton.borderSize || 0}px solid ${addToCartButton.borderColor || '#000000'}`;
            addToCartBtn.style.borderRadius = `${addToCartButton.borderRadius || 0}px`;
            addToCartBtn.style.fontSize = `${addToCartButton.fontSize || 14}px`;
            addToCartBtn.style.fontWeight = addToCartButton.fontWeight || 'normal';
            addToCartBtn.style.padding = '8px 12px';
            addToCartBtn.style.width = '100%';
            addToCartBtn.style.cursor = 'pointer';
            addToCartBtn.style.transition = '0.2s all ease-in-out';
            addToCartBtn.textContent = addToCartButton.text || "Add to cart";
            addToCartBtn.disabled = false;

            window.stickyCartButtonText = addToCartButton.text || "Add to Cart";
        } else {
            // Sold out product styling
            addToCartBtn.style.backgroundColor = addToCartButton.soldOutBackgroundColor || "#cccccc";
            addToCartBtn.style.color = addToCartButton.soldOutTextColor || "#666666";
            addToCartBtn.style.border = `${addToCartButton.soldOutBorderSize || 0}px solid ${addToCartButton.soldOutBorderColor || '#999999'}`;
            addToCartBtn.style.borderRadius = `${addToCartButton.soldOutBorderRadius || 0}px`;
            addToCartBtn.style.fontSize = `${addToCartButton.fontSize || 14}px`;
            addToCartBtn.style.fontWeight = addToCartButton.fontWeight || 'normal';
            addToCartBtn.style.padding = '8px 12px';
            addToCartBtn.style.width = '100%';
            addToCartBtn.style.cursor = 'not-allowed';
            addToCartBtn.style.transition = '0.2s all ease-in-out';
            addToCartBtn.textContent = addToCartButton.soldOutText || "Sold Out";
            addToCartBtn.disabled = true;

            window.stickyCartSoldOutText = addToCartButton.soldOutText || "Sold Out";
        }
    }

    // ✅ Initialize everything in proper sequence
    async function initializeStickyCart() {
        const { shop, id } = window.stickyCart;

        if (!id) return;

        try {
            // First, fetch product data
            await getProduct(shop, id);

            // Then, fetch and apply cart settings
            await getCart(shop);

        } catch (error) {
            console.error("Initialization error:", error);
        }
    }

    // ✅ Fetch product data
    async function getProduct(shop, id) {
        try {
            const resp = await fetch(`https://${shop}/apps/Sticky/product/${id}/${shop}`);
            const result = await resp.json();
            productData = result.data.product;
            const { title, variants, media } = productData;

            productTitle.textContent = title;

            const firstVariant = variants.edges[0].node;
            productPrice.textContent = `$${firstVariant.price}`;
            productComparePrice.textContent = firstVariant.compareAtPrice ? `$${firstVariant.compareAtPrice}` : '';

            const defaultImage =
                firstVariant.media?.edges?.[0]?.node?.preview?.image?.url ||
                media?.edges?.[0]?.node?.preview?.image?.url || '';
            productImg.src = defaultImage;

            // ✅ CRITICAL FIX: Set availability BEFORE any button updates
            currentVariantAvailable = firstVariant.availableForSale;
            console.log('Product loaded. Available:', currentVariantAvailable); // Debug log

            // Populate variant select
            variantSelect.innerHTML = '';
            variants.edges.forEach((variant) => {
                const opt = document.createElement('option');
                opt.value = variant.node.id;
                opt.textContent = variant.node.title;
                variantSelect.appendChild(opt);
            });

            variantId = firstVariant.id;

            variantSelect.addEventListener('change', (e) => {
                const selectedId = e.target.value;
                const selectedVariant = variants.edges.find(v => v.node.id === selectedId)?.node;
                if (selectedVariant) {
                    productPrice.textContent = `$${selectedVariant.price}`;
                    productComparePrice.textContent = selectedVariant.compareAtPrice ? `$${selectedVariant.compareAtPrice}` : '';
                    variantId = selectedVariant.id;

                    // Update availability for the selected variant
                    currentVariantAvailable = selectedVariant.availableForSale;
                    console.log('Variant changed. Available:', currentVariantAvailable); // Debug log

                    const newImage =
                        selectedVariant.media?.edges?.[0]?.node?.preview?.image?.url ||
                        media?.edges?.[0]?.node?.preview?.image?.url || '';
                    productImg.src = newImage;

                    // Update button styling when variant changes
                    if (stickyCartSettings) {
                        updateAddToCartButton(stickyCartSettings.addToCartButton);
                    }
                }
            });
        } catch (error) {
            console.error("Product fetch error:", error);
        }
    }



    // ✅ Fetch cart settings
    async function getCart(shop) {
        try {
            const resp = await fetch(`https://${shop}/apps/Sticky/get-sticky-cart/${shop}`);
            const result = await resp.json();
            const settings = result.data;

            if (!settings || !settings.enabled) {
                parent.style.display = 'none';
                return;
            }

            // ✅ Product display scope check
            if (!shouldDisplayProduct(settings)) {
                parent.style.display = 'none';
                return;
            }

            const {
                banner,
                productDetails,
                variantSelector,
                quantitySelector,
                addToCartButton,
                container
            } = settings;

            // Store settings globally for later use
            stickyCartSettings = settings;

            // ✅ Device display check
            if (!shouldDisplayStickyCart(container)) {
                parent.style.display = 'none';
                return;
            }

            // ✅ If we pass both product scope and device checks, then show the parent and apply styles

            stickyCartViewCount++;
            await createandUpdateStickyAnalytics(shop, { shop, productId: window.stickyCart.id, stickyViews: 1 });

            // Prepare debug data
            const previewLog = {
                productId: window.stickyCart.id,
                shop: window.stickyCart.shop,
                viewCount: stickyCartViewCount,
                pageUrl: window.location.href,
                device: isMobileDevice() ? "Mobile" : "Desktop",
                time: new Date().toISOString()
            };

            // Stylish console output
            console.group("🟢 Sticky Cart Preview");
            console.log("Product ID:", previewLog.productId);
            console.log("Shop:", previewLog.shop);
            console.log("View Count:", previewLog.viewCount);
            console.log("Page URL:", previewLog.pageUrl);
            console.log("Device:", previewLog.device);
            console.log("Time:", previewLog.time);
            console.groupEnd();
            // ✅ Container styles
            if (container.backgroundColor && container.backgroundColor.startsWith("linear-gradient(")) {
                parent.style.background = container.backgroundColor;
            } else {
                parent.style.backgroundColor = container.backgroundColor || "#000";
            }

            parent.style.border = `${container.borderSize || 0}px solid ${container.borderColor || '#000'}`;
            parent.style.borderRadius = `${container.borderRadius || 0}px`;
            parent.style.boxShadow = container.shadow ? '0px 0px 10px rgba(0,0,0,0.4)' : 'none';
            parent.style.fontFamily = container.fontFamily;

            // ✅ Size and Positioning
            applyContainerSizeAndPosition(container, parent);

            // ✅ Banner
            if (banner.show) {
                topText.style.display = 'flex';
                topText.style.backgroundColor = banner.backgroundColor;

                const hasTimer = banner.text.includes('{timer}');

                if (hasTimer) {
                    topDate.style.display = 'block';
                    topText.style.justifyContent = 'center';
                    topText.style.alignItems = 'center';

                    const displayText = banner.text.replace('{timer}', '');
                    topTextP.textContent = displayText;

                    startCountdown(banner, topDate, topText);
                } else {
                    topDate.style.display = 'none';
                    topTextP.textContent = banner.text;
                }

                topTextP.style.color = banner.textColor;
                topTextP.style.fontSize = banner.fontSize ? `${banner.fontSize}` : '16px';
                topTextP.style.fontWeight = banner.fontWeight ? 'bold' : 'normal';
                topTextP.style.fontStyle = banner.fontStyle ? 'italic' : 'normal';
                topTextP.style.textDecoration = banner.underline ? 'underline' : 'none';
                // Make timer font size same as banner text size
                topDate.style.fontSize = banner.fontSize ? `${banner.fontSize}` : '16px';
                topDate.style.color = banner.textColor;
                topDate.style.fontWeight = banner.fontWeight ? 'bold' : 'normal';
                topDate.style.fontStyle = banner.fontStyle ? 'italic' : 'normal';

            } else {
                topText.style.display = 'none';
            }

            // ✅ Product Details
            productTitle.style.display = productDetails.showTitle ? 'block' : 'none';
            productPrice.style.display = productDetails.showPrice ? 'block' : 'none';
            productComparePrice.style.display = productDetails.showComparePrice ? 'block' : 'none';

            productTitle.style.fontSize = `${productDetails.titleSize}px`;
            productTitle.style.fontWeight = productDetails.titleBold ? 'bold' : 'normal';
            productTitle.style.color = productDetails.titleColor;
            productTitle.style.fontFamily = container.fontFamily;

            productPrice.style.fontSize = `${productDetails.priceSize}px`;
            productPrice.style.color = productDetails.priceColor;
            productPrice.style.fontWeight = productDetails.priceBold ? 'bold' : 'normal';

            productComparePrice.style.fontSize = `${productDetails.comparePriceSize}px`;
            productComparePrice.style.color = productDetails.comparePriceColor;
            productComparePrice.style.fontWeight = productDetails.comparePriceBold ? 'bold' : 'normal';

            const productImageWithVariantContainer = document.querySelector('.product-image-content-variant');
            const productImageContainer = document.querySelector('.product-image');

            // ✅ Product Image
            productImageWithVariantContainer.classList.add(productDetails.showImage && variantSelector.show ? 'with-image' : 'without-image');
            productImageContainer.style.display = productDetails.showImage ? 'block' : 'none';

            // ✅ Variant Selector
            if (variantSelector.show) {
                variantsContainer.style.display = 'block';
                variantSelect.style.color = variantSelector.textColor;
                variantSelect.style.fontSize = `${variantSelector.fontSize}px`;
                variantSelect.style.fontWeight = variantSelector.isBold ? 'bold' : 'normal';

                const qtyBg = (variantSelector.backgroundColor || "").trim();
                qtyInp.style.backgroundColor = qtyBg;
                qtyContainer.style.backgroundColor = qtyBg;
                productInfo.style.backgroundColor = qtyBg;

                productInfo.style.border = `${quantitySelector.borderSize || 0}px solid ${quantitySelector.borderColor || '#000'}`;
                productInfo.style.borderRadius = `${quantitySelector.borderRadius || 0}px`;
            } else {
                variantsContainer.style.display = 'none';
            }

            // ✅ Quantity Selector
            if (quantitySelector.show) {
                qtyContainer.style.display = 'flex';

                const qtyBg = (variantSelector.backgroundColor || "").trim();
                qtyInp.style.backgroundColor = qtyBg;
                qtyContainer.style.backgroundColor = qtyBg;
                productInfo.style.backgroundColor = qtyBg;

                productInfo.style.border = `${quantitySelector.borderSize || 0}px solid ${quantitySelector.borderColor || '#000'}`;
                productInfo.style.borderRadius = `${quantitySelector.borderRadius || 0}px`;

                qtyInp.style.color = quantitySelector.textColor;
                qtyInp.style.fontSize = `${quantitySelector.fontSize}px`;
                qtyInp.style.fontWeight = quantitySelector.isBold ? "bold" : "normal";
                qtyInp.style.textAlign = "center";
                qtyInp.style.width = "40px";
                qtyInp.style.margin = "0 5px";
                plusbtn.style.backgroundColor = "transparent";
                minusbtn.style.backgroundColor = "transparent";
                plusbtn.style.border = "none";
                minusbtn.style.border = "none";

                const iconColor = quantitySelector.iconColor || "#000";

                [plusbtn, minusbtn].forEach(btn => {
                    btn.style.color = iconColor;
                    btn.style.width = "20px";
                    btn.style.height = "30px";
                    btn.style.display = "flex";
                    btn.style.alignItems = "center";
                    btn.style.cursor = "pointer";
                    btn.style.userSelect = "none";
                });
            } else {
                qtyContainer.style.display = 'none';
            }
            parent.style.display = 'block';

            // ✅ CRITICAL FIX: Update button styling AFTER product data is loaded
            // This ensures currentVariantAvailable is set correctly
            updateAddToCartButton(addToCartButton);

            // ✅ Save action globally for addToCart behavior
            window.stickyCartAction = addToCartButton.action || "cart";

        } catch (error) {
            console.error("Sticky Cart Settings Error:", error);
        }
    }

    // ✅ Countdown function
    function startCountdown(banner, topDate, topText) {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        let targetTime;

        if (banner.coundownDate) {
            targetTime = new Date(banner.coundownDate).getTime();
        } else if (banner.fixedminute) {
            const [days, hours, minutes, seconds] = banner.fixedminute.split(' ').map(Number);
            const updatedAt = new Date(banner.updatedAt || Date.now()).getTime();
            targetTime = updatedAt +
                (days * 24 * 60 * 60 * 1000) +
                (hours * 60 * 60 * 1000) +
                (minutes * 60 * 1000) +
                (seconds * 1000);
        } else {
            topDate.textContent = "";
            return;
        }

        countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetTime - now;

            if (distance <= 0) {
                clearInterval(countdownInterval);

                if (banner.TimerEnd === "hide") {
                    topDate.style.display = 'none';
                    const bannerText = banner.text.replace('{timer}', '').trim();
                    if (!bannerText) {
                        topText.style.display = 'none';
                    }
                } else {
                    topDate.textContent = "00:00:00";
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((distance / (1000 * 60)) % 60);
            const seconds = Math.floor((distance / 1000) % 60);

            if (days > 0) {
                topDate.textContent = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                topDate.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    // ✅ Container Size and Position function
    function applyContainerSizeAndPosition(container, parent) {
        parent.style.position = 'fixed';
        parent.style.left = '0';
        parent.style.right = '0';
        parent.style.top = 'auto';
        parent.style.bottom = 'auto';
        parent.style.width = '100%';
        parent.style.maxWidth = 'none';
        parent.style.margin = '0';

        if (container.size === "condensed") {
            const condensedValue = container.CondensedValue || "800";
            parent.style.width = `${condensedValue}px`;
            parent.style.maxWidth = '90%';
            parent.style.margin = '0 auto';

            if (container.horizontalPosition === "left") {
                parent.style.left = container.LeftOffset ? `${container.LeftOffset}%` : '0';
                parent.style.right = 'auto';
                parent.style.margin = '0';
            } else if (container.horizontalPosition === "right") {
                parent.style.right = container.RightOffset ? `${container.RightOffset}%` : '0';
                parent.style.left = 'auto';
                parent.style.margin = '0';
            } else {
                parent.style.left = '50%';
                parent.style.transform = 'translateX(-50%)';
                parent.style.margin = '0';
            }
        } else {
            parent.style.width = '100%';
            parent.style.left = '0';
            parent.style.right = '0';
        }

        if (container.position === "bottom") {
            parent.style.bottom = container.BottomOffset ? `${container.BottomOffset}%` : '0';
            parent.style.top = 'auto';
        } else if (container.position === "top") {
            parent.style.top = container.TopOffset ? `${container.TopOffset}%` : '0';
            parent.style.bottom = 'auto';
        }
    }

    // ✅ Initialize everything in proper sequence
    initializeStickyCart();
});