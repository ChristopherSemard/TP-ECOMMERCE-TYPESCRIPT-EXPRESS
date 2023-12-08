"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateValidator = exports.createValidator = exports.idValidator = void 0;
const express_validator_1 = require("express-validator");
exports.idValidator = [(0, express_validator_1.param)("id").notEmpty().isNumeric()];
exports.createValidator = [
    (0, express_validator_1.body)("firstname").notEmpty(),
    (0, express_validator_1.body)("lastname").notEmpty(),
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").notEmpty(),
    (0, express_validator_1.body)("password", "The minimum password length is 10 characters").isLength({
        min: 10,
    }),
];
exports.updateValidator = [
    (0, express_validator_1.param)("id").notEmpty().isNumeric(),
    (0, express_validator_1.body)("firstname").notEmpty().optional(),
    (0, express_validator_1.body)("lastname").notEmpty().optional(),
    (0, express_validator_1.body)("email").isEmail().optional(),
];
