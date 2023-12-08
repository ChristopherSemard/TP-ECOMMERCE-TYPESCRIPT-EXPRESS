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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../utils/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const users_1 = require("../validators/users");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUsers = yield db_1.default.user.findMany();
    return res.status(200).send(existingUsers);
}));
router.get("/:id", users_1.idValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
        const existingUser = yield db_1.default.user.findUnique({
            where: {
                id: parseFloat(id),
            },
        });
        if (!existingUser) {
            return res.status(404).send("Not found");
        }
        else {
            const { password } = existingUser, userInfos = __rest(existingUser, ["password"]);
            return res.status(200).send(userInfos);
        }
    }
    return res.status(422).json({ errors: errors.array() });
}));
router.post("/", users_1.createValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        const { firstname, lastname, email, password } = req.body;
        try {
            const existingEmail = yield db_1.default.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (!existingEmail) {
                const hashPassword = yield bcrypt_1.default.hash(password, 10, function (err, hash) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const newUser = yield db_1.default.user.create({
                                data: {
                                    firstname,
                                    lastname,
                                    email,
                                    password: hash,
                                },
                            });
                            console.log(newUser);
                            const { password } = newUser, userInfos = __rest(newUser, ["password"]);
                            return res.status(201).json(userInfos);
                        }
                        catch (e) {
                            console.log("ERROR CREATION USER : " + e);
                            return res.status(500).send("ERROR");
                        }
                    });
                });
            }
            else {
                return res.status(400).send("Email already used");
            }
        }
        catch (e) {
            return res.status(500).json(e);
        }
    }
    else {
        return res.status(422).json({ errors: errors.array() });
    }
}));
router.patch("/:id", users_1.updateValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        if (isNaN(parseFloat(id))) {
            return res
                .status(400)
                .send("Bad Request : id must be a valid integer");
        }
        else {
            const existingUser = yield db_1.default.user.findUnique({
                where: {
                    id: parseFloat(id),
                },
            });
            if (!existingUser) {
                return res.status(404).send("Not found");
            }
            else {
                const { firstname, lastname, email } = req.body;
                const userToUpdate = {
                    firstname,
                    lastname,
                    email,
                };
                try {
                    const updateUser = yield db_1.default.user.update({
                        where: {
                            id: existingUser.id,
                        },
                        data: userToUpdate,
                    });
                    const { password } = updateUser, updatedUser = __rest(updateUser, ["password"]);
                    return res.status(201).json(updatedUser);
                }
                catch (e) {
                    console.log(e);
                    return res.status(500).json(e);
                }
            }
        }
    }
    return res.status(422).json({ errors: errors.array() });
}));
router.delete("/:id", users_1.idValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        const { id } = req.params;
        const existingUser = yield db_1.default.user.findUnique({
            where: {
                id: parseFloat(id),
            },
        });
        if (!existingUser) {
            return res.status(404).send("Not found");
        }
        else {
            const deleteUser = yield db_1.default.user.delete({
                where: {
                    id: parseFloat(id),
                },
            });
            return res.status(200).send(deleteUser);
        }
    }
    return res.status(422).json({ errors: errors.array() });
}));
exports.default = router;
