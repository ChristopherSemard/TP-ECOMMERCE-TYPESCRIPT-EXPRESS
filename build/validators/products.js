"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateValidator = exports.createValidator = exports.idValidator = void 0;
const express_validator_1 = require("express-validator");
exports.idValidator = [(0, express_validator_1.param)("id").notEmpty().isNumeric()];
exports.createValidator = [
    (0, express_validator_1.body)("name").notEmpty(),
    (0, express_validator_1.body)("description").notEmpty(),
    (0, express_validator_1.body)("price").isDecimal(),
];
exports.updateValidator = [
    (0, express_validator_1.param)("id").notEmpty().isNumeric(),
    (0, express_validator_1.body)("name").notEmpty().optional(),
    (0, express_validator_1.body)("description").notEmpty().optional(),
    (0, express_validator_1.body)("price").isDecimal().optional(),
];
