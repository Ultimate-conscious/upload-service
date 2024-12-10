import { Router } from "express";

export const fileRouter = Router();


fileRouter.get('/', (req, res) => {
    res.send("File Route check");
});


