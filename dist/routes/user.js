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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const __1 = require("..");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get('/', (req, res) => {
    res.send("User Route check");
});
/**
 * @description This route is used to sign up a user
 * @route POST /user/signup
 * @body {email: string, password: string, name: string}
 */
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    //TODO: input validation
    const existinguser = yield __1.prisma.user.findUnique({
        where: {
            email
        }
    });
    if (existinguser) {
        res.status(400).json({ error: "User already exists" });
        return;
    }
    // TODO: hash the password
    const user = yield __1.prisma.user.create({
        data: {
            email,
            password,
            name
        }
    });
    //TODO: JWT token
    res.status(201).json({ message: "User created successfully" });
}));
/**
 * @description This route is used to login a user
 * @route POST /user/login
 * @body {email: string, password: string}
 */
exports.userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //TODO: input validation
    const user = yield __1.prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        res.status(400).json({ error: "User does not exist" });
        return;
    }
    if (user.password !== password) {
        res.status(400).json({ error: "Invalid password" });
        return;
    }
    // TODO: JWT token
    res.status(200).json({ message: "User logged in successfully" });
}));
