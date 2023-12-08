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
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUsers = yield db_1.default.user.findMany();
    console.log(req.user);
    // let usersInfos: User[] = [];
    // existingUsers.forEach((user) => {
    //     const { password, ...userInfos } = user;
    //     usersInfos.push(userInfos);
    // });
    return res.status(200).send(existingUsers);
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(parseFloat(id))) {
        return res.status(400).send("Bad Request : id must be a valid integer");
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
            const { password } = existingUser, userInfos = __rest(existingUser, ["password"]);
            return res.status(200).send(userInfos);
        }
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, password } = req.body;
    try {
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
                }
            });
        });
    }
    catch (e) {
        return res.status(500).json(e);
    }
}));
router.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(parseFloat(id))) {
        return res.status(400).send("Bad Request : id must be a valid integer");
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
            const _a = req.body, { password } = _a, userToUpdate = __rest(_a, ["password"]);
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
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(parseFloat(id))) {
        return res.status(400).send("Bad Request : id must be a valid integer");
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
            const deleteUser = yield db_1.default.user.delete({
                where: {
                    id: parseFloat(id),
                },
            });
            return res.status(200).send(deleteUser);
        }
    }
}));
exports.default = router;
