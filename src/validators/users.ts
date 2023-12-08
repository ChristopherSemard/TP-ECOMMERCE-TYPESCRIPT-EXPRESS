import { body, param } from "express-validator";

export const idValidator = [param("id").notEmpty().isNumeric()];

export const createValidator = [
    body("firstname").notEmpty(),
    body("lastname").notEmpty(),
    body("email").isEmail(),
    body("password").notEmpty(),
    body("password", "The minimum password length is 10 characters").isLength({
        min: 10,
    }),
];

export const updateValidator = [
    param("id").notEmpty().isNumeric(),
    body("firstname").notEmpty().optional(),
    body("lastname").notEmpty().optional(),
    body("email").isEmail().optional(),
];
