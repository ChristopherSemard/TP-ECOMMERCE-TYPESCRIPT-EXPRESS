"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateValidator = exports.createValidator = exports.idValidator = void 0;
const express_validator_1 = require("express-validator");
exports.idValidator = [(0, express_validator_1.param)("id").not().isEmpty()];
exports.createValidator = [
    (0, express_validator_1.body)("firstname").not().isEmpty(),
    (0, express_validator_1.body)("lastname").not().isEmpty(),
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").not().isEmpty(),
    (0, express_validator_1.body)("password", "The minimum password length is 10 characters").isLength({
        min: 10,
    }),
];
exports.updateValidator = [
    (0, express_validator_1.body)("firstname").not().isEmpty().optional(),
    (0, express_validator_1.body)("lastname").not().isEmpty().optional(),
    (0, express_validator_1.body)("email").isEmail().optional(),
];
