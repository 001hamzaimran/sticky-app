import mongoose from "mongoose";

const ProductCartSchema = new mongoose.Schema({
    shop: { type: String, required: true, unique: true },
    productId: { type: String, required: true },
    Number: { type: Number, required: true }, 
});

const ProductCartModel = mongoose.model("ProductCart", ProductCartSchema);
export default ProductCartModel