import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: [true, "Quantity is required"], min: 1 },
        }
    ],
    status: { type: String, enum: ["Pending", "Processing", "Delivered", "Shipped", "Cancelled"], default: "Pending" },
    orderDate: { type: Date, default: Date.now() },
    totalAmount: { type: Number, required: [true, "Total amount is required"] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }

}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

export default Order;