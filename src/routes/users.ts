import express from "express";
import prisma from "../utils/db";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { validationResult } from "express-validator";
import {
    createValidator,
    updateValidator,
    idValidator,
} from "../validators/users";
import { Request, Response } from "express";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const existingUsers = await prisma.user.findMany();
    return res.status(200).send(existingUsers);
});

router.get("/:id", idValidator, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
        const existingUser = await prisma.user.findUnique({
            where: {
                id: parseFloat(id),
            },
        });
        if (!existingUser) {
            return res.status(404).send("Not found");
        } else {
            const { password, ...userInfos } = existingUser;
            return res.status(200).send(userInfos);
        }
    }
    return res.status(422).json({ errors: errors.array() });
});

router.post("/", createValidator, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { firstname, lastname, email, password } = req.body;
        try {
            const hashPassword = await bcrypt.hash(
                password,
                10,
                async function (err, hash) {
                    try {
                        const newUser = await prisma.user.create({
                            data: {
                                firstname,
                                lastname,
                                email,
                                password: hash,
                            },
                        });
                        console.log(newUser);

                        const { password, ...userInfos } = newUser;
                        return res.status(201).json(userInfos);
                    } catch (e) {
                        console.log("ERROR CREATION USER : " + e);
                    }
                }
            );
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    return res.status(422).json({ errors: errors.array() });
});

router.patch("/:id", updateValidator, async (req: Request, res: Response) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        if (isNaN(parseFloat(id))) {
            return res
                .status(400)
                .send("Bad Request : id must be a valid integer");
        } else {
            const existingUser = await prisma.user.findUnique({
                where: {
                    id: parseFloat(id),
                },
            });
            if (!existingUser) {
                return res.status(404).send("Not found");
            } else {
                const { firstname, lastname, email } = req.body;
                const userToUpdate = {
                    firstname,
                    lastname,
                    email,
                };

                try {
                    const updateUser = await prisma.user.update({
                        where: {
                            id: existingUser.id,
                        },
                        data: userToUpdate,
                    });

                    const { password, ...updatedUser } = updateUser;
                    return res.status(201).json(updatedUser);
                } catch (e) {
                    console.log(e);
                    return res.status(500).json(e);
                }
            }
        }
    }
    return res.status(422).json({ errors: errors.array() });
});

router.delete("/:id", idValidator, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
        const existingUser = await prisma.user.findUnique({
            where: {
                id: parseFloat(id),
            },
        });
        if (!existingUser) {
            return res.status(404).send("Not found");
        } else {
            const deleteUser = await prisma.user.delete({
                where: {
                    id: parseFloat(id),
                },
            });
            return res.status(200).send(deleteUser);
        }
    }
    return res.status(422).json({ errors: errors.array() });
});

export default router;
