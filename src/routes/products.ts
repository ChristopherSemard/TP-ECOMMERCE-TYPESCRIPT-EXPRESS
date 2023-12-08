import express from "express";
import prisma from "../utils/db";
import bcrypt from "bcrypt";
import { Product } from "@prisma/client";
import { Request, Response } from "express";
import {
    createValidator,
    updateValidator,
    idValidator,
} from "../validators/products";
import { validationResult } from "express-validator";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const products = await prisma.product.findMany();
    return res.status(200).send(products);
});

router.get("/:id", idValidator, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: {
                id: parseFloat(id),
            },
        });
        if (!product) {
            return res.status(404).send("Not found");
        } else {
            return res.status(200).send(product);
        }
    }
    return res.status(422).json({ errors: errors.array() });
});

router.post("/", createValidator, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { name, description, price } = req.body;

        try {
            const product = await prisma.product.create({
                data: {
                    name,
                    description,
                    price,
                },
            });
            console.log(product);

            return res.status(201).json(product);
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
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: parseFloat(id),
            },
        });
        if (!existingProduct) {
            return res.status(404).send("Product not found");
        } else {
            try {
                const updateProduct = await prisma.product.update({
                    where: {
                        id: existingProduct.id,
                    },
                    data: req.body,
                });

                return res.status(201).json(updateProduct);
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
        const existingProduct = await prisma.user.findUnique({
            where: {
                id: parseFloat(id),
            },
        });
        if (!existingProduct) {
            return res.status(404).send("Not found");
        } else {
            const deleteProduct = await prisma.product.delete({
                where: {
                    id: parseFloat(id),
                },
            });
            return res.status(200).send(deleteProduct);
        }
    }
    return res.status(422).json({ errors: errors.array() });
});

export default router;
