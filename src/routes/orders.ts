import express from "express";
import prisma from "../utils/db";
import bcrypt from "bcrypt";
import { Order, User } from "@prisma/client";
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

router.post("/", createValidator, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { orderItems } = req.body;

        try {
            const jwtUser = req.user as User;

            const order = await prisma.order.create({
                data: {
                    userId: jwtUser.id,
                    orderItems: {
                        create: orderItems,
                    },
                    total: 50,
                },
                include: {
                    orderItems: true,
                },
            });

            return res.status(201).json(order);
        } catch (e) {
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
        const existingOrder = await prisma.user.findUnique({
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
            });
            return res.status(200).send(deleteOrder);
        }
    }
    return res.status(422).json({ errors: errors.array() });
});

export default router;
