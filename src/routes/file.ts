import { Router } from "express";
import { uploadMiddleware } from "../utils/multer";
import { prisma } from "../index";

export const fileRouter = Router();


fileRouter.get('/', (req, res) => {
    res.send("File Route check");
});




fileRouter.post("/upload",uploadMiddleware,async (req, res) => {
    console.log(req.file);

    const file = await prisma.file.create({
        data:{
            name: req.file?.filename || "No name",
            mimetype: req.file?.mimetype || "No mimetype",
            size: req.file?.size || -1,
            uploadedAt: new Date(),
            userId: "not-me"
        }
    })
    res.send("File uploaded successfully");

});

fileRouter.get("/download/:id", async (req, res) => {

});

fileRouter.delete("/delete/:id", async (req, res) => {
    
});