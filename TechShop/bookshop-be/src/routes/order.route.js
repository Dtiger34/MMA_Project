import express from "express";
import db from "../models/index.js";

const OrderRouter = express.Router();

OrderRouter.post("/create", async (req, res, next) => {
    try {
        const { userId, items } = req.body;

        console.log(userId);

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "An order must have at least one item"
            });
        }

        let totalAmount = 0;

        for (const item of items) {
            const product = await db.Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({
                    message: `Product with id ${item.productId} not found`
                });
            }

            if (product.unitInStock < item.quantity) {
                return res.json({
                    text: "stock",
                    message: `Product ${product.name} has only ${product.unitInStock} units in stock`
                });
            }

            product.unitInStock -= item.quantity;
            await product.save();

            totalAmount += product.price * item.quantity;
        }

        const newOrder = new db.Order({
            items,
            status: "Pending",
            orderDate: new Date(),
            totalAmount,
            userId
        });
        console.log(newOrder);

        await newOrder.save();

        res.status(201).json({
            message: "Order created successfully",
            result: newOrder
        });

    } catch (err) {
        next(err);
    }
});

OrderRouter.get("/getAllByUserId/:userId", async (req, res, next) => {
    try {
        const { userId } = req.params;
        const orders = await db.Order.find({ userId }).populate("items.productId").exec();
        if (orders) {
            return res.status(200).json({
                message: "Orders found",
                result: orders.map(order => {
                    return {
                        id: order._id,
                        items: order.items.map(item => {
                            return {
                                name: item.productId.name,
                                price: item.productId.price,
                                quantity: item.quantity
                            }
                        }),
                        status: order.status,
                        orderDate: order.orderDate,
                        totalAmount: order.totalAmount
                    }
                })
            });
        } else {
            return res.status(404).json({
                message: "Orders not found"
            });
        }
    } catch (err) {
        next(err);
    }
});




export default OrderRouter;


