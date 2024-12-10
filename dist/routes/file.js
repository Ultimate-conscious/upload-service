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
exports.fileRouter = void 0;
const express_1 = require("express");
const multer_1 = require("../utils/multer");
const index_1 = require("../index");
const path_1 = __importDefault(require("path"));
const authmiddleware_1 = __importDefault(require("../authmiddleware"));
const fs_1 = __importDefault(require("fs"));
exports.fileRouter = (0, express_1.Router)();
exports.fileRouter.get('/', (req, res) => {
    res.send("File Route check");
});
exports.fileRouter.post("/upload", authmiddleware_1.default, multer_1.uploadMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const file = yield index_1.prisma.file.create({
        data: {
            name: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname) || "No name",
            key: ((_b = req.file) === null || _b === void 0 ? void 0 : _b.filename) || "No key",
            mimetype: ((_c = req.file) === null || _c === void 0 ? void 0 : _c.mimetype) || "No mimetype",
            size: ((_d = req.file) === null || _d === void 0 ? void 0 : _d.size) || -1,
            uploadedAt: new Date(Date.now()),
            //@ts-ignore
            userId: req.user.id
        }
    });
    res.send("File uploaded successfully");
}));
exports.fileRouter.get("/download/:fileId", authmiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileId } = req.params;
    const file = yield index_1.prisma.file.findUnique({
        where: {
            key: fileId
        }
    });
    //@ts-ignore
    if (req.user.id !== (file === null || file === void 0 ? void 0 : file.userId) || !file) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const filePath = path_1.default.join(process.env.UPLOAD_PATH || '', fileId);
    res.download(filePath, file === null || file === void 0 ? void 0 : file.name, (err) => {
        if (err) {
            console.error(err);
            res.status(404).json({ message: 'File not found' });
        }
    });
}));
exports.fileRouter.delete("/delete/:fileid", authmiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileid } = req.params;
    const file = yield index_1.prisma.file.findUnique({
        where: {
            key: fileid
        }
    });
    //@ts-ignore
    if ((file === null || file === void 0 ? void 0 : file.userId) !== req.user.id || !file) {
        res.status(404).json({ message: "Unauthorized" });
        return;
    }
    const filePath = path_1.default.join(process.env.UPLOAD_PATH || '', fileid);
    fs_1.default.unlinkSync(filePath);
    yield index_1.prisma.file.delete({
        where: {
            key: fileid
        }
    });
    res.json({ message: "File deleted successfully" });
}));
