import { body, param } from "express-validator";

export const idValidator = [param("id").notEmpty().isNumeric()];

export const createValidator = [
    body("orderItems").isArray({ min: 1 }),
    body("orderItems.*.productId").notEmpty().isNumeric(),
    body("orderItems.*.quantity").notEmpty().isNumeric(),
];

export const updateValidator = [
    param("id").notEmpty().isNumeric(),
    body("orderItems").isArray({ min: 1 }),
    body("orderItems.*.productId").notEmpty().isNumeric(),
    body("orderItems.*.quantity").notEmpty().isNumeric(),
];
