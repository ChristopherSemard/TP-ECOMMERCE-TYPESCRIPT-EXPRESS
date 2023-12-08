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
const orders_1 = require("../validators/orders");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield db_1.default.order.findMany();
    return res.status(200).send(orders);
}));
router.get("/:id", orders_1.idValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
        const order = yield db_1.default.order.findUnique({
            where: {
                id: parseFloat(id),
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });
        if (!order) {
            return res.status(404).send("Not found");
        }
        else {
            return res.status(200).send(order);
        }
    }
    return res.status(422).json({ errors: errors.array() });
}));
// async function getOrderItemsWithPrice(orderItems: OrderItem[], res: Response) {
//     let orderItemsWithPrice: OrderItem[] = [];
//     orderItems.map(async (item: OrderItem) => {
//         const product = await prisma.product.findUnique({
//             where: {
//                 id: item.productId,
//             },
//         });
//         if (!product) {
//             return res.status(404).send("Product in orderItems not found");
//         } else {
//             item.price = product.price;
//             orderItemsWithPrice.push(item);
//         }
//     });
//     return orderItemsWithPrice;
// }
// async function getTotalOrderPrice(orderItems: OrderItem[], res: Response) {
//     let totalPrice = 0;
//     orderItems.map((item: OrderItem) => {
//         totalPrice = totalPrice + item.price;
//         console.log(totalPrice);
//     });
//     return totalPrice;
// }
router.post("/", orders_1.createValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        const { orderItems } = req.body;
        try {
            const jwtUser = req.user;
            let orderItemsWithPrice = [];
            let totalPrice = 0;
            yield Promise.all(orderItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield db_1.default.product.findUnique({
                    where: {
                        id: item.productId,
                    },
                });
                if (!product) {
                    return res
                        .status(404)
                        .send("Product in orderItems not found");
                }
                else {
                    item.price = product.price;
                    orderItemsWithPrice.push(item);
                    totalPrice = totalPrice + product.price * item.quantity;
                }
            })));
            console.log(orderItemsWithPrice);
            console.log(totalPrice);
            const order = yield db_1.default.order.create({
                data: {
                    userId: jwtUser.id,
                    orderItems: {
                        create: orderItemsWithPrice,
                    },
                    total: totalPrice,
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                    user: true,
                },
            });
            return res.status(201).json(order);
        }
        catch (e) {
            console.log(e);
            return res.status(500).json(e);
        }
    }
    return res.status(422).json({ errors: errors.array() });
}));
router.patch("/:id", orders_1.updateValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
        const existingOrder = yield db_1.default.order.findUnique({
            where: {
                id: parseFloat(id),
            },
            include: {
                orderItems: true,
            },
        });
        if (!existingOrder) {
            return res.status(404).send("Not found");
        }
        else {
            try {
                yield db_1.default.orderItem.deleteMany({
                    where: {
                        orderId: existingOrder.id,
                    },
                });
                const { orderItems } = req.body;
                const updateOrder = yield db_1.default.order.update({
                    where: {
                        id: existingOrder.id,
                    },
                    data: {
                        orderItems: {
                            create: orderItems,
                        },
                    },
                    include: {
                        orderItems: {
                            include: {
                                product: true,
                            },
                        },
                        user: true,
                    },
                });
                return res.status(201).json(updateOrder);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json(e);
            }
        }
    }
    return res.status(422).json({ errors: errors.array() });
}));
router.delete("/:id", orders_1.idValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
        const existingOrder = yield db_1.default.order.findUnique({
            where: {
                id: parseFloat(id),
            },
        });
        if (!existingOrder) {
            return res.status(404).send("Not found");
        }
        else {
            const deleteOrder = yield db_1.default.order.delete({
                where: {
                    id: parseFloat(id),
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                    user: true,
                },
            });
            return res.status(200).send(deleteOrder);
        }
    }
    return res.status(422).json({ errors: errors.array() });
}));
exports.default = router;
