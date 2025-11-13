window.addEventListener('DOMContentLoaded', () => {
    const plusbtn = document.getElementById('plus');
    const minusbtn = document.getElementById('minus');
    const qtyInp = document.getElementById('qtyInp');
    const parent = document.getElementById('parent');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const variantsContainer = document.getElementById('variantsContainer');
    const topText = document.querySelector('.top-text');
    const topTextP = topText.querySelector('p');
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
            .then(() => (window.location.href = "/cart"))
            .catch(err => {
                console.error("Add to Cart Error:", err);
                alert("Something went wrong while adding the product to the cart.");
            });
    });

    // ✅ Fetch product and cart settings
    const { shop, id } = window.stickyCart;

    if (id) {
        const getProduct = async () => {
            try {
                const resp = await fetch(`https://${shop}/apps/Sticky/product/${id}/${shop}`);
                const result = await resp.json();
                const { title, variants, media } = result.data.product;

                productTitle.textContent = title;
                parent.style.display = 'block';

                // Always populate variant data but don't show it yet
                // The display will be controlled by getCart() settings
                const firstVariant = variants.edges[0].node;
                productPrice.textContent = `$${firstVariant.price}`;

                const defaultImage =
                    firstVariant.media?.edges?.[0]?.node?.preview?.image?.url ||
                    media?.edges?.[0]?.node?.preview?.image?.url || '';

                productImg.src = defaultImage;

                // Populate variant select options
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
                    const selectedVariant = variants.edges.find((v) => v.node.id === selectedId)?.node;
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
                console.error(error);
            }
        };

        const getCart = async () => {
            try {
                const resp = await fetch(`https://${shop}/apps/Sticky/get-sticky-cart/${shop}`);
                const result = await resp.json();
                const settings = result.data;

                if (!settings.enabled) {
                    parent.style.display = 'none';
                    return;
                }

                // ✅ Apply dynamic container styling
                const { container, banner, productDetails, variantSelector, quantitySelector, addToCartButton } = settings;

                parent.style.backgroundColor = container.backgroundColor || '#000';
                parent.style.borderRadius = `${container.borderRadius || 0}px`;
                parent.style.boxShadow = container.shadow ? '0px 0px 10px rgba(0,0,0,0.4)' : 'none';
                parent.style.bottom = container.position === 'bottom' ? '0' : 'auto';
                parent.style.top = container.position === 'top' ? '0' : 'auto';

                // ✅ Banner
                if (banner.show) {
                    topText.style.display = 'block';
                    topText.style.backgroundColor = banner.backgroundColor;
                    topTextP.textContent = banner.text;
                    topTextP.style.color = banner.textColor;
                    topTextP.style.fontWeight = banner.fontWeight;
                    topTextP.style.fontStyle = banner.fontStyle;
                    topTextP.style.textDecoration = banner.underline ? 'underline' : 'none';
                } else {
                    topText.style.display = 'none';
                }

                // ✅ Product details
                productTitle.style.display = productDetails.showTitle ? 'block' : 'none';
                productTitle.style.fontWeight = productDetails.titleBold ? 'bold' : 'normal';
                productTitle.style.color = productDetails.titleColor;

                productPrice.style.display = productDetails.showPrice ? 'block' : 'none';
                productPrice.style.color = productDetails.priceColor;

                // ✅ Product Image - ADD THIS SECTION
                const productImageContainer = document.querySelector('.product-image');
                if (productDetails.showImage) {
                    productImageContainer.style.display = 'block';
                } else {
                    productImageContainer.style.display = 'none';
                }

                // ✅ Variant selector
                if (variantSelector.show) {
                    variantsContainer.style.display = 'block';
                    variantSelect.style.color = variantSelector.textColor;
                    variantSelect.style.backgroundColor = variantSelector.backgroundColor;
                } else {
                    variantsContainer.style.display = 'none';
                }

                // ✅ Quantity selector
                if (quantitySelector.show) {
                    qtyContainer.style.display = 'flex';
                    qtyInp.style.backgroundColor = quantitySelector.backgroundColor;
                    qtyInp.style.color = quantitySelector.textColor;
                    qtyInp.style.borderColor = quantitySelector.textColor;
                    plusbtn.style.color = quantitySelector.textColor;
                    minusbtn.style.color = quantitySelector.textColor;
                } else {
                    qtyContainer.style.display = 'none';
                }

                // ✅ Add to Cart Button
                addToCartBtn.textContent = addToCartButton.text;
                addToCartBtn.style.backgroundColor = addToCartButton.backgroundColor;
                addToCartBtn.style.color = addToCartButton.textColor;
                addToCartBtn.style.fontWeight = addToCartButton.fontWeight;

            } catch (error) {
                console.error("Error fetching sticky cart settings:", error);
            }
        };

        getProduct();
        getCart();
    }
});
