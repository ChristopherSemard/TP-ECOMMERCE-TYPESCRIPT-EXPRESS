import express from "express";
import "dotenv/config";
import auth from "./routes/auth";
import users from "./routes/users";
import products from "./routes/products";
import orders from "./routes/orders";
import passport from "passport";
import { limiter } from "./middleware/ratelimiter";
import helmet from "helmet";

import "./utils/passport.js";

const app = express();
const port = 3000;

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    return res.send("Bonjour");
});

app.use("/auth", auth);
app.use("/users", passport.authenticate("jwt", { session: false }), users);
app.use(
    "/products",
    passport.authenticate("jwt", { session: false }),
    products
);
app.use("/orders", passport.authenticate("jwt", { session: false }), orders);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
