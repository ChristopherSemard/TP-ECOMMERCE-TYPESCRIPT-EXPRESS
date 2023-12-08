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
const products_1 = require("../validators/products");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield db_1.default.product.findMany({
        where: {
            deleted: false,
        },
    });
    return res.status(200).send(products);
}));
router.get("/:id", products_1.idValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
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
    return res.status(422).json({ errors: errors.array() });
}));
router.post("/", products_1.createValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
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
    }
    return res.status(422).json({ errors: errors.array() });
}));
router.patch("/:id", products_1.updateValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
        const existingProduct = yield db_1.default.product.findUnique({
            where: {
                id: parseFloat(id),
            },
        });
        if (!existingProduct) {
            return res.status(404).send("Product not found");
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
    return res.status(422).json({ errors: errors.array() });
}));
router.delete("/:id", products_1.idValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
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
                const deleteProduct = yield db_1.default.product.update({
                    where: {
                        id: parseFloat(id),
                    },
                    data: { deleted: true },
                });
                console.log(deleteProduct);
                return res.status(201).send(deleteProduct);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json(e);
            }
        }
    }
    return res.status(422).json({ errors: errors.array() });
}));
exports.default = router;
