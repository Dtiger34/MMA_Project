import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import httpErrors from "http-errors";

import CategoryRouter from "./routes/category.route.js";
import ProductRouter from "./routes/product.route.js";
import UserRouter from "./routes/user.route.js";
import OrderRouter from "./routes/order.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", async (req, res, next) => {
    res.status(200).send({ message: "Welcome to Restful API server" });
});

//Recieve request 
app.use("/categories", CategoryRouter);
app.use("/products", ProductRouter)
app.use("/users", UserRouter);
app.use("/orders", OrderRouter);
app.use("/auth", authRouter);

//Error handling
app.use(async (req, res, next) => {
    next(httpErrors.BadRequest("Bad request"));
});

app.use(async (err, req, res, next) => {
    res.status = err.status || 500,
        res.send({
            "error": {
                "status": err.status || 500,
                "message": err.message
            }
        });
})

export default app;