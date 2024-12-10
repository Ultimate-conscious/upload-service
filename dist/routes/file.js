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
exports.fileRouter = void 0;
const express_1 = require("express");
const multer_1 = require("../utils/multer");
const index_1 = require("../index");
exports.fileRouter = (0, express_1.Router)();
exports.fileRouter.get('/', (req, res) => {
    res.send("File Route check");
});
exports.fileRouter.post("/upload", multer_1.uploadMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log(req.file);
    const file = yield index_1.prisma.file.create({
        data: {
            name: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || "No name",
            mimetype: ((_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype) || "No mimetype",
            size: ((_c = req.file) === null || _c === void 0 ? void 0 : _c.size) || -1,
            uploadedAt: new Date(),
            userId: "not-me"
        }
    });
    res.send("File uploaded successfully");
}));
