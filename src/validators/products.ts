import { body, param } from "express-validator";

export const idValidator = [param("id").notEmpty().isNumeric()];

export const createValidator = [
    body("name").notEmpty(),
    body("description").notEmpty(),
    body("price").isDecimal(),
];

export const updateValidator = [
    param("id").notEmpty().isNumeric(),
    body("name").notEmpty().optional(),
    body("description").notEmpty().optional(),
    body("price").isDecimal().optional(),
];
