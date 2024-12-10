"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
function authMiddleware(req, res, next) {
    // not very graceful, imporve in future
    try {
        //@ts-ignore
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const payload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET || "");
        //@ts-ignore
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
}
exports.default = authMiddleware;
