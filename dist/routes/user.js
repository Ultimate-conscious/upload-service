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
exports.userRouter = void 0;
const express_1 = require("express");
const __1 = require("..");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const types_1 = require("../utils/types");
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
    try {
        const { success } = types_1.SignupSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({ error: "Invalid input" });
            return;
        }
        const { email, password, name } = req.body;
        const existinguser = yield __1.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (existinguser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield __1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email }, process.env.JWT_SECRET || "", { expiresIn: "1d" });
        res.status(201).json({
            message: "User created successfully",
            token
        });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error, please try again later" });
    }
}));
/**
 * @description This route is used to login a user
 * @route POST /user/login
 * @body {email: string, password: string}
 */
exports.userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = types_1.LoginSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({ error: "Invalid input" });
            return;
        }
        const { email, password } = req.body;
        const user = yield __1.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            res.status(400).json({ error: "User does not exist" });
            return;
        }
        bcryptjs_1.default.compare(password, user.password, (err, result) => {
            if (!result) {
                res.status(400).json({ error: "Invalid password" });
                return;
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email }, process.env.JWT_SECRET || "", { expiresIn: "1d" });
        res.status(200).json({
            message: "User logged in successfully",
            token
        });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error, please try again later" });
    }
}));
