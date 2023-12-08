"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateValidator = exports.createValidator = exports.idValidator = void 0;
const express_validator_1 = require("express-validator");
exports.idValidator = [(0, express_validator_1.param)("id").not().isEmpty().isNumeric()];
exports.createValidator = [
    (0, express_validator_1.body)("name").not().isEmpty(),
    (0, express_validator_1.body)("description").not().isEmpty(),
    (0, express_validator_1.body)("price").isDecimal(),
];
exports.updateValidator = [
    (0, express_validator_1.param)("id").not().isEmpty().isNumeric(),
    (0, express_validator_1.body)("name").not().isEmpty().optional(),
    (0, express_validator_1.body)("description").not().isEmpty().optional(),
    (0, express_validator_1.body)("price").isDecimal().optional(),
];
