window.addEventListener('DOMContentLoaded', () => {
    const plusbtn = document.getElementById('plus');
    const minusbtn = document.getElementById('minus');
    const qtyInp = document.getElementById('qtyInp');
    const parent = document.getElementById('parent');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const variantsContainer = document.getElementById('variantsContainer');
    let variantId;

    // ✅ Quantity controls
    plusbtn.addEventListener('click', () => {
        qtyInp.value++;
    });

    minusbtn.addEventListener('click', () => {
        if (qtyInp.value > 0) {
            qtyInp.value--;
        }
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
                window.location.href = "/cart";
            })
            .catch(err => {
                console.error("Add to Cart Error:", err);
                alert("Something went wrong while adding the product to the cart.");
            });
    });

    // ✅ Shopify Product Fetch
    const { shop, id } = window.stickyCart;

    if (id) {
        const getProduct = async () => {
            try {
                const resp = await fetch(`https://${shop}/apps/Sticky/product/${id}/${shop}`);
                const result = await resp.json();
                const { title, variants, media } = result.data.product;

                const titleEl = document.getElementById('productTitle');
                const priceEl = document.getElementById('productPrice');
                const imgEl = document.getElementById('productImg');
                const variantSelect = document.getElementById('variantsItem');

                titleEl.textContent = title;
                parent.style.display = 'block';

                // ✅ If product has variants
                if (variants.edges.length > 1) {
                    variantsContainer.style.display = 'block'; // show dropdown

                    const firstVariant = variants.edges[0].node;
                    priceEl.textContent = firstVariant.price;

                    const defaultImage =
                        firstVariant.media?.edges?.[0]?.node?.preview?.image?.url ||
                        media?.edges?.[0]?.node?.preview?.image?.url || '';

                    imgEl.src = defaultImage;

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
                            priceEl.textContent = selectedVariant.price;
                            variantId = selectedVariant.id;

                            const newImage =
                                selectedVariant.media?.edges?.[0]?.node?.preview?.image?.url ||
                                media?.edges?.[0]?.node?.preview?.image?.url || '';

                            imgEl.src = '';
                            imgEl.src = newImage;
                        }
                    });
                }
                // ✅ If product has no variants
                else {
                    variantsContainer.style.display = 'none'; // hide variant div
                    const firstVariant = variants.edges[0]?.node;
                    variantId = firstVariant?.id;
                    priceEl.textContent = firstVariant?.price || 'N/A';
                    imgEl.src =
                        firstVariant?.media?.edges?.[0]?.node?.preview?.image?.url ||
                        media?.edges?.[0]?.node?.preview?.image?.url || '';
                }
            } catch (error) {
                console.error(error);
            }
        };

        getProduct();
    }
});
