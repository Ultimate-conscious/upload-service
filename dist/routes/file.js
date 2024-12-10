"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileRouter = void 0;
const express_1 = require("express");
exports.fileRouter = (0, express_1.Router)();
exports.fileRouter.get('/', (req, res) => {
    res.send("File Route check");
});
