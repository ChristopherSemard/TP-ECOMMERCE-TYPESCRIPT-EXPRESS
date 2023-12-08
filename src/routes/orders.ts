import express from "express";
import prisma from "../utils/db";
import bcrypt from "bcrypt";
import { Order, OrderItem, User } from "@prisma/client";
import { Request, Response } from "express";
import {
    createValidator,
    updateValidator,
    idValidator,
} from "../validators/orders";
import { validationResult } from "express-validator";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const orders = await prisma.order.findMany();
    return res.status(200).send(orders);
});

router.get("/:id", idValidator, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
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
        } else {
            return res.status(200).send(order);
        }
    }
    return res.status(422).json({ errors: errors.array() });
});

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

router.post("/", createValidator, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { orderItems } = req.body;

        try {
            const jwtUser = req.user as User;

            let orderItemsWithPrice: OrderItem[] = [];
            let totalPrice = 0;

            await Promise.all(
                orderItems.map(async (item: OrderItem) => {
                    const product = await prisma.product.findUnique({
                        where: {
                            id: item.productId,
                        },
                    });
                    if (!product) {
                        return res
                            .status(404)
                            .send("Product in orderItems not found");
                    } else {
                        item.price = product.price;
                        orderItemsWithPrice.push(item);
                        totalPrice = totalPrice + product.price * item.quantity;
                    }
                })
            );

            console.log(orderItemsWithPrice);
            console.log(totalPrice);

            const order = await prisma.order.create({
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
        } catch (e) {
            console.log(e);
            return res.status(500).json(e);
        }
    }
    return res.status(422).json({ errors: errors.array() });
});

router.patch("/:id", updateValidator, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
        const existingOrder = await prisma.order.findUnique({
            where: {
                id: parseFloat(id),
            },
            include: {
                orderItems: true,
            },
        });
        if (!existingOrder) {
            return res.status(404).send("Not found");
        } else {
            try {
                await prisma.orderItem.deleteMany({
                    where: {
                        orderId: existingOrder.id,
                    },
                });
                const { orderItems } = req.body;
                const updateOrder = await prisma.order.update({
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
            } catch (e) {
                console.log(e);
                return res.status(500).json(e);
            }
        }
    }
    return res.status(422).json({ errors: errors.array() });
});

router.delete("/:id", idValidator, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
        const existingOrder = await prisma.order.findUnique({
            where: {
                id: parseFloat(id),
            },
        });
        if (!existingOrder) {
            return res.status(404).send("Not found");
        } else {
            const deleteOrder = await prisma.order.delete({
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
});

export default router;
