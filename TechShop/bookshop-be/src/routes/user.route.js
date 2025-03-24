import express from "express";
import db from "../models/index.js";

const UserRouter = express.Router();


UserRouter.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await db.User.findById(id).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User found",
            user: user
        });
    } catch (err) {
        next(err);
    }
}
);

UserRouter.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await db.User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User updated",
            user: user
        });
    } catch (err) {
        next(err);
    }
}
);

UserRouter.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await db.User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User deleted",
            user: user
        });
    } catch (err) {
        next(err);
    }
}
);

//getAll users
UserRouter.get("/admin/getAll", async (req, res, next) => {
    try {
        const users = await db.User.find().select("-password");
        if (!users) {
            res.status(404).json({ message: "Users not found" });
        }
        res.status(200).json({
            message: "Users found",
            users: users
        });
    } catch (err) {
        next(err);
    }
}
);  


export default UserRouter;