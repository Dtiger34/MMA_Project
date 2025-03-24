import express from "express";
import db from "../models/index.js";

const CategoryRouter = express.Router();

CategoryRouter.post("/create", async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const newCategory = await db.Category.create({ name, description });

        //Insert one
        await newCategory.save().then(newDoc => {
            res.status(201).json({
                message: "Category created successfully",
                result: {
                    categoryCode: newDoc._id,
                    name: newDoc.name,
                    desc: newDoc.description
                }
            });
        });
    } catch (err) {
        next(err);
    }
});

//getAll categories
CategoryRouter.get("/getAll", async (req, res, next) => {
    try {
        const categories = await db.Category.find();
        console.log(categories);
        if (!categories) {
            res.status(404).json({ message: "Categories not found" });
        }
        res.status(200).json({
            message: "Categories found",
            result: categories
        });
    } catch (err) {
        next(err);
    }
}
);


export default CategoryRouter;