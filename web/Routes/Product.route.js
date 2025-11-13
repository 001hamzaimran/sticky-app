import { Router } from 'express'
import getProductById, { getProducts } from '../Controller/Product.Controller.js'

const productRoute = Router()
productRoute.get('/product/:id/:shop', getProductById)
productRoute.get('/get-products', getProducts)

export default productRoute