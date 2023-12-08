import { body } from "express-validator";

export const signinValidator = [
    body("email").isEmail(),
    body("password").notEmpty(),
];
