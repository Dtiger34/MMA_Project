import express from "express";
import db from "../models/index.js";

const ProductRouter = express.Router();

ProductRouter.post("/create", async (req, res, next) => {
    try {
        const newProduct = await db.Product.create(req.body);

        //Insert one
        await newProduct.save().then(newDoc => {
            res.status(201).json({
                message: "Product created successfully",
                result: newDoc
            });
        });
    } catch (err) {
        next(err);
    }
});

ProductRouter.get("/getAll", async (req, res, next) => {
    try {
        const products = await db.Product.find({}).populate("category").exec();

        if (products) {
            return res.status(200).json({
                message: "Products found",
                result: products
            })
        } else {
            return res.status(404).json({
                message: "Products not found"
            });
        }

    } catch (err) {
        next(err);
    }
});

ProductRouter.get("/category/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const products = await db.Product.find({ category: id }).populate("category").exec();

        if (products) {
            return res.status(200).json({
                message: "Products found",
                result: products
            })
        } else {
            return res.status(404).json({
                message: "Products not found"
            });
        }

    } catch (err) {
        next(err);
    }
});

//get product by id
ProductRouter.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await db.Product.findById(id).populate("category").exec();

        if (product) {
            return res.status(200).json({
                message: "Product found",
                result: product
            })
        } else {
            return res.status(404).json({
                message: "Product not found"
            });
        }

    } catch (err) {
        next(err);
    }
});

//update product
ProductRouter.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const product = await db.Product.findByIdAndUpdate(id, data, { new: true }).populate("category").exec();

        if (product) {
            return res.status(200).json({
                message: "Product updated",
                result: product
            })
        } else {
            return res.status(404).json({
                message: "Product not found"
            });
        }

    } catch (err) {
        next(err);
    }
});

//delete product
ProductRouter.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await db.Product.findByIdAndDelete(id);

        if (product) {
            return res.status(200).json({
                message: "Product deleted",
                result: product
            })
        } else {
            return res.status(404).json({
                message: "Product not found"
            });
        }

    } catch (err) {
        next(err);
    }
});


export default ProductRouter;
