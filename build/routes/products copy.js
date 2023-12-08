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
const db_1 = __importDefault(require("../utils/db"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield db_1.default.product.findMany();
    return res.status(200).send(products);
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(parseFloat(id))) {
        return res.status(400).send("Bad Request : id must be a valid integer");
    }
    else {
        const product = yield db_1.default.product.findUnique({
            where: {
                id: parseFloat(id),
            },
        });
        if (!product) {
            return res.status(404).send("Not found");
        }
        else {
            return res.status(200).send(product);
        }
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price } = req.body;
    try {
        const product = yield db_1.default.product.create({
            data: {
                name,
                description,
                price,
            },
        });
        console.log(product);
        return res.status(201).json(product);
    }
    catch (e) {
        return res.status(500).json(e);
    }
}));
router.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(parseFloat(id))) {
        return res.status(400).send("Bad Request : id must be a valid integer");
    }
    else {
        const existingProduct = yield db_1.default.product.findUnique({
            where: {
                id: parseFloat(id),
            },
        });
        if (!existingProduct) {
            return res.status(404).send("Not found");
        }
        else {
            try {
                const updateProduct = yield db_1.default.product.update({
                    where: {
                        id: existingProduct.id,
                    },
                    data: req.body,
                });
                return res.status(201).json(updateProduct);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json(e);
            }
        }
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(parseFloat(id))) {
        return res.status(400).send("Bad Request : id must be a valid integer");
    }
    else {
        const existingProduct = yield db_1.default.user.findUnique({
            where: {
                id: parseFloat(id),
            },
        });
        if (!existingProduct) {
            return res.status(404).send("Not found");
        }
        else {
            const deleteProduct = yield db_1.default.product.delete({
                where: {
                    id: parseFloat(id),
                },
            });
            return res.status(200).send(deleteProduct);
        }
    }
}));
exports.default = router;
