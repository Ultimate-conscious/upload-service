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
const multer_2 = __importDefault(require("multer"));
exports.fileRouter = (0, express_1.Router)();
exports.fileRouter.get('/', (req, res) => {
    res.send("File Route check");
});
/**
 * @description Upload a file
 * @body file: File to be uploaded
 */
exports.fileRouter.post("/upload", authmiddleware_1.default, (req, res, next) => {
    (0, multer_1.uploadMiddleware)(req, res, (err) => {
        if (err instanceof multer_2.default.MulterError) {
            // Handle Multer-specific errors
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size exceeds 5MB limit.' });
            }
            return res.status(400).json({ message: err.message });
        }
        else if (err) {
            // Handle other errors (e.g., file type)
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
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
        res.send({
            message: "File uploaded successfully",
            fileId: file.key,
        });
    }
    catch (error) {
    }
}));
/**
 * @description Download a file
 * @param fileId: File ID
 */
exports.fileRouter.get("/download/:fileId", authmiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error while downloading' });
    }
}));
/**
 * @description Delete a file
 * @param fileid: File ID
 */
exports.fileRouter.delete("/delete/:fileid", authmiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    }
    catch (error) {
        res.status(500).json({ message: "Error while deleting file" });
    }
}));
/**
 * @description List all files
 * @returns List of files
*/
exports.fileRouter.get("/list", authmiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield index_1.prisma.file.findMany({
        where: {
            //@ts-ignore
            userId: req.user.id
        }
    });
    const fileInfoArray = files.map((file) => {
        return {
            fileId: file.key,
            filename: file.name
        };
    });
    res.json({
        files: fileInfoArray
    });
}));
