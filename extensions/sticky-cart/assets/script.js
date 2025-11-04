window.addEventListener('DOMContentLoaded', () => {
    const { shop, id } = window.stickyCart;

    if (id) {
        console.log(shop)
        console.log(id)
        const getProduct = async () => {
            try {
                const resp = await fetch(`https://${shop}/apps/Sticky/product/${id}/${shop}`);
                const result = await resp.json();
                console.log(result)
            } catch (error) {
                console.error(error)
            }
        }
        getProduct()
    }


});