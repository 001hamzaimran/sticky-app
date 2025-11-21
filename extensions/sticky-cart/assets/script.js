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

    // ✅ Quantity controls
    plusbtn.addEventListener('click', () => qtyInp.value++);
    minusbtn.addEventListener('click', () => {
        if (qtyInp.value > 0) qtyInp.value--;
    });

    // ✅ Add to Cart
    addToCartBtn.addEventListener('click', () => {
        if (!variantId) {
            alert("Please select a variant before adding to cart.");
            return;
        }

        const splitvariantId = variantId.split("/").pop();
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
                const action = window.stickyCartAction || "cart"; // fallback if missing
                if (action === "cart") {
                    window.location.href = "/cart";
                } else if (action === "checkout") {
                    window.location.href = "/checkout";
                } else {
                    // stay on page, maybe show a small confirmation
                    window.location.reload();
                    addToCartBtn.textContent = "Added!";
                    setTimeout(() => addToCartBtn.textContent = "Add to Cart", 1500);
                }
            })

            .catch(err => {
                console.error("Add to Cart Error:", err);
                alert("Something went wrong while adding the product to the cart.");
            });
    });

    // ✅ Fetch product and sticky cart settings
    const { shop, id } = window.stickyCart;

    if (!id) return;

    const getProduct = async () => {
        try {
            const resp = await fetch(`https://${shop}/apps/Sticky/product/${id}/${shop}`);
            const result = await resp.json();
            const { title, variants, media } = result.data.product;

            productTitle.textContent = title;
            parent.style.display = 'block';

            const firstVariant = variants.edges[0].node;
            productPrice.textContent = `$${firstVariant.price}`;
            productComparePrice.textContent = `$${firstVariant.compareAtPrice}`;
            const defaultImage =
                firstVariant.media?.edges?.[0]?.node?.preview?.image?.url ||
                media?.edges?.[0]?.node?.preview?.image?.url || '';
            productImg.src = defaultImage;

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
                    productComparePrice.textContent = `$${selectedVariant.compareAtPrice}`;
                    variantId = selectedVariant.id;
                    const newImage =
                        selectedVariant.media?.edges?.[0]?.node?.preview?.image?.url ||
                        media?.edges?.[0]?.node?.preview?.image?.url || '';
                    productImg.src = newImage;
                }
            });
        } catch (error) {
            console.error("Product fetch error:", error);
        }
    };

    const getCart = async () => {
        try {
            const resp = await fetch(`https://${shop}/apps/Sticky/get-sticky-cart/${shop}`);
            const result = await resp.json();
            const settings = result.data;

            if (!settings || !settings.enabled) {
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

            // ✅ Container styles
            if (container.backgroundColor && container.backgroundColor.startsWith("linear-gradient(")) {
                parent.style.background = container.backgroundColor; // use background for gradients
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

                // Check if banner text contains {timer}
                const hasTimer = banner.text.includes('{timer}');

                if (hasTimer) {
                    // Show timer and replace {timer} with actual timer element
                    topDate.style.display = 'block';
                    topText.style.justifyContent = 'center';
                    topText.style.alignItems = 'center';

                    // Replace {timer} with empty string initially, we'll update the timer separately
                    const displayText = banner.text.replace('{timer}', '');
                    topTextP.textContent = displayText;

                    // Start countdown only if timer is present in text
                    startCountdown(banner, topDate, topText);
                } else {
                    // No timer, just show the text
                    topDate.style.display = 'none';
                    topTextP.textContent = banner.text;
                }

                topTextP.style.color = banner.textColor;
                topTextP.style.fontSize = banner.fontSize ? `${banner.fontSize}px` : '16px';
                topTextP.style.fontWeight = banner.fontWeight ? 'bold' : 'normal';
                topTextP.style.fontStyle = banner.fontStyle ? 'italic' : 'normal';
                topTextP.style.textDecoration = banner.underline ? 'underline' : 'none';
            } else {
                topText.style.display = 'none';
            }

            // ✅ Product Details
            productTitle.style.display = productDetails.showTitle ? 'block' : 'none';
            productPrice.style.display = productDetails.showPrice ? 'block' : 'none';
            productComparePrice.style.display = productDetails.showComparePrice ? 'block' : 'none';

            // Product title
            productTitle.style.fontSize = `${productDetails.titleSize}px`;
            productTitle.style.fontWeight = productDetails.titleBold ? 'bold' : 'normal';
            productTitle.style.color = productDetails.titleColor;
            productTitle.style.fontFamily = container.fontFamily;

            // Product price
            productPrice.style.fontSize = `${productDetails.priceSize}px`;
            productPrice.style.color = productDetails.priceColor;
            productPrice.style.fontWeight = productDetails.priceBold ? 'bold' : 'normal';

            // Product compare price
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

                // Background color
                const qtyBg = (variantSelector.backgroundColor || "").trim();
                qtyInp.style.backgroundColor = qtyBg;
                qtyContainer.style.backgroundColor = qtyBg;
                productInfo.style.backgroundColor = qtyBg;

                productInfo.style.border = `${quantitySelector.borderSize || 0}px solid ${quantitySelector.borderColor || '#000'}`;
                productInfo.style.borderRadius = `${quantitySelector.borderRadius || 0}px`;

            } else {
                variantsContainer.style.display = 'none';
            };

            // ✅ Quantity Selector
            if (quantitySelector.show) {
                qtyContainer.style.display = 'flex';

                // Background color
                const qtyBg = (variantSelector.backgroundColor || "").trim();
                qtyInp.style.backgroundColor = qtyBg;
                qtyContainer.style.backgroundColor = qtyBg;
                productInfo.style.backgroundColor = qtyBg;

                productInfo.style.border = `${quantitySelector.borderSize || 0}px solid ${quantitySelector.borderColor || '#000'}`;
                productInfo.style.borderRadius = `${quantitySelector.borderRadius || 0}px`;

                // Input styles
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

                // Plus/Minus button styles
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

            // ✅ Add to Cart Button 
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

            // ✅ Save action globally for addToCart behavior
            window.stickyCartAction = addToCartButton.action || "cart";

        } catch (error) {
            console.error("Sticky Cart Settings Error:", error);
        }
    };

    // ✅ Countdown function
    function startCountdown(banner, topDate, topText) {
        // Clear any existing interval
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        let targetTime;

        if (banner.coundownDate) {
            // Countdown to a specific date
            targetTime = new Date(banner.coundownDate).getTime();
        } else if (banner.fixedminute) {
            // Parse "1 2 5 1" → [days, hours, minutes, seconds]
            const [days, hours, minutes, seconds] = banner.fixedminute.split(' ').map(Number);

            // Calculate end timestamp based on updatedAt
            const updatedAt = new Date(banner.updatedAt || Date.now()).getTime();
            targetTime = updatedAt +
                (days * 24 * 60 * 60 * 1000) +
                (hours * 60 * 60 * 1000) +
                (minutes * 60 * 1000) +
                (seconds * 1000);
        } else {
            // No valid countdown configuration
            topDate.textContent = "";
            return;
        }

        countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetTime - now;

            if (distance <= 0) {
                clearInterval(countdownInterval);

                // Timer ended - handle TimerEnd setting
                if (banner.TimerEnd === "hide") {
                    topDate.style.display = 'none';
                    // Also hide the entire banner if it only contained the timer
                    const bannerText = banner.text.replace('{timer}', '').trim();
                    if (!bannerText) {
                        topText.style.display = 'none';
                    }
                } else {
                    topDate.textContent = "00:00:00";
                }
                return;
            }

            // Calculate time units
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((distance / (1000 * 60)) % 60);
            const seconds = Math.floor((distance / 1000) % 60);

            // Format display based on whether we have days
            if (days > 0) {
                topDate.textContent = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                topDate.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    // ✅ Container Size and Position function
    function applyContainerSizeAndPosition(container, parent) {
        // Reset positioning
        parent.style.position = 'fixed';
        parent.style.left = '0';
        parent.style.right = '0';
        parent.style.top = 'auto';
        parent.style.bottom = 'auto';
        parent.style.width = '100%';
        parent.style.maxWidth = 'none';
        parent.style.margin = '0';

        // Apply size
        if (container.size === "condensed") {
            const condensedValue = container.CondensedValue || "800";
            parent.style.width = `${condensedValue}px`;
            parent.style.maxWidth = '90%'; // Ensure it doesn't overflow on small screens
            parent.style.margin = '0 auto';

            // Apply horizontal positioning for condensed mode
            if (container.horizontalPosition === "left") {
                parent.style.left = container.LeftOffset ? `${container.LeftOffset}%` : '0';
                parent.style.right = 'auto';
                parent.style.margin = '0';
            } else if (container.horizontalPosition === "right") {
                parent.style.right = container.RightOffset ? `${container.RightOffset}%` : '0';
                parent.style.left = 'auto';
                parent.style.margin = '0';
            } else {
                // center (default)
                parent.style.left = '50%';
                parent.style.transform = 'translateX(-50%)';
                parent.style.margin = '0';
            }
        } else {
            // full size
            parent.style.width = '100%';
            parent.style.left = '0';
            parent.style.right = '0';
        }

        // Apply vertical positioning and offsets
        if (container.position === "bottom") {
            parent.style.bottom = container.BottomOffset ? `${container.BottomOffset}%` : '0';
            parent.style.top = 'auto';
        } else if (container.position === "top") {
            parent.style.top = container.TopOffset ? `${container.TopOffset}%` : '0';
            parent.style.bottom = 'auto';
        }
    }

    getProduct();
    getCart();
});