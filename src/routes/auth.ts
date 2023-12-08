import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/db";
import { validationResult } from "express-validator";
import { signinValidator } from "../validators/auth";
import { Request, Response } from "express";
const router = express.Router();

router.post(
    "/signin",
    signinValidator,
    async function (req: Request, res: Response) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const { email, password } = req.body;
            try {
                const existingUser = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });
                if (!existingUser) {
                    return res.status(401).send("Invalid email or password");
                } else {
                    const isSamePassword = await bcrypt.compare(
                        password,
                        existingUser.password
                    );
                    if (!isSamePassword) {
                        return res
                            .status(401)
                            .send("Invalid email or password");
                    }

                    const token = jwt.sign(
                        { user: existingUser },
                        process.env.JWT_SECRET as string,
                        {
                            expiresIn: "1h",
                        }
                    );
                    return res.json({ token });
                }
            } catch (e) {
                console.log(e);
                return res.json({ error: e });
            }
        }
        res.status(422).json({ errors: errors.array() });
    }
);

export default router;
