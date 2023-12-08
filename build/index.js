"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const ratelimiter_1 = require("./middleware/ratelimiter");
const helmet_1 = __importDefault(require("helmet"));
require("./utils/passport.js");
const app = (0, express_1.default)();
const port = 3000;
app.use(ratelimiter_1.limiter);
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send("Bonjour");
}));
app.use("/auth", auth_1.default);
// app.use("/users", passport.authenticate("jwt", { session: false }), users);
// app.use(
//     "/products",
//     passport.authenticate("jwt", { session: false }),
//     products
// );
// app.use("/orders", passport.authenticate("jwt", { session: false }), orders);
app.use("/users", users_1.default);
app.use("/products", products_1.default);
app.use("/orders", orders_1.default);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
