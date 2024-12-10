import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // not very graceful, imporve in future

    try {

        //@ts-ignore
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const payload = verify(token, process.env.JWT_SECRET || "");
        //@ts-ignore
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
}

export default authMiddleware;