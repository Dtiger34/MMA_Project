import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: [true, "Product name is required"] },
    price: { type: Number, required: [true, "Product price is required"] },
    description: { type: String },
    author: { type: String },
    unitInStock: { type: Number },
    image: { type: String },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }

}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;