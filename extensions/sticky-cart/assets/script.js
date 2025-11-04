window.addEventListener('DOMContentLoaded', () => {
    const plusbtn = document.getElementById('plus')
    const minusbtn = document.getElementById('minus')
    const qtyInp = document.getElementById('qtyInp')

    plusbtn.addEventListener('click', () => {
        qtyInp.value++
    })
    minusbtn.addEventListener('click', () => {
        if (qtyInp.value > 0) {
            qtyInp.value--;
        }
    })

    const { shop, id } = window.stickyCart;

    if (id) {
        console.log(shop)
        console.log(id)
        const getProduct = async () => {
            try {
                const resp = await fetch(`https://${shop}/apps/Sticky/product/${id}`)
                const result = await resp.json();
                console.log(result)


            } catch (error) {
                console.error(error)
            }
        }
        getProduct()
    }


});