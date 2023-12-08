"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../utils/db"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../validators/auth");
const router = express_1.default.Router();
router.post("/signin", auth_1.signinValidator, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            const { email, password } = req.body;
            try {
                const existingUser = yield db_1.default.user.findUnique({
                    where: {
                        email: email,
                    },
                });
                if (!existingUser) {
                    return res.status(401).send("Invalid email or password");
                }
                else {
                    const isSamePassword = yield bcrypt_1.default.compare(password, existingUser.password);
                    if (!isSamePassword) {
                        return res
                            .status(401)
                            .send("Invalid email or password");
                    }
                    const token = jsonwebtoken_1.default.sign({ user: existingUser }, process.env.JWT_SECRET, {
                        expiresIn: "1h",
                    });
                    return res.json({ token });
                }
            }
            catch (e) {
                console.log(e);
                return res.json({ error: e });
            }
        }
        res.status(422).json({ errors: errors.array() });
    });
});
exports.default = router;
