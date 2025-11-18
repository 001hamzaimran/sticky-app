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
    const productImg = document.getElementById('productImg');
    const variantSelect = document.getElementById('variantsItem');
    const qtyContainer = document.querySelector('.qty-container');
    let variantId;

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


            if (banner.Countdown !== "hide") {
                topDate.style.display = 'block';
                topText.style.justifyContent = 'center';
                topText.style.alignItems = 'center';

                if (banner.coundownDate) {
                    // Countdown to a specific date
                    const targetDate = new Date(banner.coundownDate).getTime();

                    const interval = setInterval(() => {
                        const now = new Date().getTime();
                        const distance = targetDate - now;

                        if (distance <= 0) {
                            clearInterval(interval);
                            topDate.textContent = "00:00:00";
                            return;
                        }

                        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
                        const minutes = Math.floor((distance / (1000 * 60)) % 60);
                        const seconds = Math.floor((distance / 1000) % 60);

                        topDate.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    }, 1000);

                } else if (banner.fixedminute) {
                    // Parse "1 2 5 1" → [days, hours, minutes, seconds]
                    const [days, hours, minutes, seconds] = banner.fixedminute.split(' ').map(Number);

                    // Calculate end timestamp based on updatedAt
                    const updatedAt = new Date(settings.updatedAt).getTime();
                    const targetTime = updatedAt +
                        (days * 24 * 60 * 60 * 1000) +
                        (hours * 60 * 60 * 1000) +
                        (minutes * 60 * 1000) +
                        (seconds * 1000);

                    const interval = setInterval(() => {
                        const now = new Date().getTime();
                        const distance = targetTime - now;

                        if (distance <= 0) {
                            clearInterval(interval);
                            topDate.textContent = "00:00:00:00";
                            return;
                        }

                        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
                        const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
                        const m = Math.floor((distance / (1000 * 60)) % 60);
                        const s = Math.floor((distance / 1000) % 60);

                        topDate.textContent = `${d.toString().padStart(2, '0')}:${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                    }, 1000);
                }
            }


            // ✅ Container styles
            if (container.backgroundColor && container.backgroundColor.startsWith("linear-gradient(")) {
                parent.style.background = container.backgroundColor; // use background for gradients
            } else {
                parent.style.backgroundColor = container.backgroundColor || "#000";
            }

            parent.style.border = `${container.borderSize || 0}px solid ${container.borderColor || '#000'}`;
            parent.style.borderRadius = `${container.borderRadius || 0}px`;
            parent.style.boxShadow = container.shadow ? '0px 0px 10px rgba(0,0,0,0.4)' : 'none';
            parent.style.bottom = container.position === 'bottom' ? '0' : 'auto';
            parent.style.top = container.position === 'top' ? '0' : 'auto';
            parent.style.fontFamily = container.fontFamily;

            // ✅ Banner
            if (banner.show) {
                topText.style.display = 'flex';
                topText.style.backgroundColor = banner.backgroundColor;
                topTextP.textContent = banner.text;
                topTextP.style.color = banner.textColor;
                topTextP.style.fontWeight = banner.fontWeight;
                topTextP.style.fontStyle = banner.fontStyle;
                topTextP.style.textDecoration = banner.underline ? 'underline' : 'none';
            } else {
                topText.style.display = 'none';
            }

            // ✅ Product Details
            productTitle.style.display = productDetails.showTitle ? 'block' : 'none';
            productTitle.style.fontWeight = productDetails.titleBold ? 'bold' : 'normal';
            productTitle.style.color = productDetails.titleColor;
            productTitle.style.fontSize = `${productDetails.titleSize}px`;
            productTitle.style.fontFamily = container.fontFamily;

            productPrice.style.display = productDetails.showPrice ? 'block' : 'none';
            productPrice.style.color = productDetails.priceColor;
            productPrice.style.fontSize = `${productDetails.priceSize}px`;
            productPrice.style.fontWeight = productDetails.priceBold ? 'bold' : 'normal';

            const productImageWithVariantContainer = document.querySelector('.product-image-content-variant');
            const productImageContainer = document.querySelector('.product-image');

            productImageWithVariantContainer.classList.add(productDetails.showImage && variantSelector.show ? 'with-image' : 'without-image');
            productImageContainer.style.display = productDetails.showImage ? 'block' : 'none';

            // ✅ Variant Selector
            if (variantSelector.show) {
                variantsContainer.style.display = 'block';
                variantSelect.style.color = variantSelector.textColor;
                variantSelect.style.fontSize = `${variantSelector.fontSize}px`;
                variantSelect.style.backgroundColor = variantSelector.backgroundColor;
                variantSelect.style.fontWeight = variantSelector.isBold ? 'bold' : 'normal';
            } else {
                variantsContainer.style.display = 'none';
            }

            // ✅ // ✅ Quantity Selector
            if (quantitySelector.show) {
                qtyContainer.style.display = 'flex';

                // Input styles
                qtyInp.style.backgroundColor = quantitySelector.backgroundColor;
                qtyInp.style.color = quantitySelector.textColor;
                qtyInp.style.borderColor = quantitySelector.borderColor;
                qtyInp.style.borderWidth = `${quantitySelector.borderWidth}px`;
                qtyInp.style.borderStyle = "solid";
                qtyInp.style.fontSize = `${quantitySelector.fontSize}px`;
                qtyInp.style.fontWeight = quantitySelector.isBold ? "bold" : "normal";
                qtyInp.style.textAlign = "center";
                qtyInp.style.width = "40px";
                qtyInp.style.margin = "0 5px";

                // Plus/Minus button styles
                const iconSize = `${quantitySelector.IconSize || 14}px`;
                const iconColor = quantitySelector.iconColor || "#000";
                const iconBg = quantitySelector.backgroundColor || "#eee";

                [plusbtn, minusbtn].forEach(btn => {
                    btn.style.backgroundColor = iconBg || "";
                    btn.style.color = iconColor;
                    btn.style.fontSize = iconSize;
                    btn.style.width = "20px";
                    btn.style.height = "30px";
                    btn.style.display = "flex";
                    btn.style.alignItems = "center";
                    btn.style.justifyContent = "center";
                    btn.style.border = quantitySelector.borderColor ? `1px solid ${quantitySelector.borderColor}` : "none";
                    btn.style.borderRadius = "4px";
                    btn.style.cursor = "pointer";
                    btn.style.userSelect = "none";
                });
            } else {
                qtyContainer.style.display = 'none';
            }


            // ✅ Add to Cart Button
            addToCartBtn.textContent = addToCartButton.text;
            addToCartBtn.style.backgroundColor = addToCartButton.backgroundColor || "#007cdb";
            addToCartBtn.style.color = addToCartButton.textColor;
            addToCartBtn.style.fontWeight = addToCartButton.fontWeight;
            addToCartBtn.style.fontSize = `${addToCartButton.fontSize}px`;
            addToCartBtn.style.borderRadius = `${addToCartButton.borderRadius}px`;
            addToCartBtn.style.borderColor = addToCartButton.borderColor;
            addToCartBtn.style.borderWidth = `${addToCartButton.borderWidth}px`;
            addToCartBtn.style.borderStyle = "solid";
            // ✅ Save action globally for addToCart behavior
            window.stickyCartAction = addToCartButton.action || "cart";


        } catch (error) {
            console.error("Sticky Cart Settings Error:", error);
        }
    };

    getProduct();
    getCart();
});