import { Router } from "express";
import { uploadMiddleware } from "../utils/multer";
import { prisma } from "../index";
import path from 'path';
import authMiddleware from "../authmiddleware";
import fs from "fs";

export const fileRouter = Router();


fileRouter.get('/', (req, res) => {
    res.send("File Route check");
});


/**
 * @description Upload a file
 * @body file: File to be uploaded
 */
fileRouter.post("/upload",authMiddleware ,uploadMiddleware,async (req, res) => {

    const file = await prisma.file.create({
        data:{
            name: req.file?.originalname || "No name",
            key: req.file?.filename || "No key",
            mimetype: req.file?.mimetype || "No mimetype",
            size: req.file?.size || -1,
            uploadedAt: new Date(Date.now()),
            //@ts-ignore
            userId: req.user.id
        }
    })
    res.send("File uploaded successfully");

});

/**
 * @description Download a file
 * @param fileId: File ID
 */
fileRouter.get("/download/:fileId",authMiddleware ,async (req, res) => {
    const { fileId } = req.params;
    const file = await prisma.file.findUnique({
        where: {
            key: fileId
        }
    })
    //@ts-ignore
    if(req.user.id !== file?.userId || !file){
        res.status(401).json({message: "Unauthorized"});
        return;
    }
    

    const filePath = path.join(process.env.UPLOAD_PATH ||'', fileId);

    res.download(filePath,file?.name, (err) => {
        if (err) {
            console.error(err);
            res.status(404).json({ message: 'File not found' });
        }
    });


});

/**
 * @description Delete a file
 * @param fileid: File ID
 */
fileRouter.delete("/delete/:fileid",authMiddleware ,async (req, res) => {
    const { fileid } = req.params;
    const file = await prisma.file.findUnique({
        where: {
            key: fileid
        }
    })
    //@ts-ignore
    if(file?.userId!== req.user.id||!file){
        res.status(404).json({message: "Unauthorized"});
        return;
    }
    const filePath = path.join(process.env.UPLOAD_PATH ||'', fileid);

    fs.unlinkSync(filePath);

    await prisma.file.delete({
        where: {
            key: fileid
        }
    })

    res.json({message: "File deleted successfully"});
});

/**
 * @description List all files
 * @returns List of files
*/
fileRouter.get("/list",authMiddleware ,async (req, res) => {
    const files = await prisma.file.findMany({
        where: {
            //@ts-ignore
            userId: req.user.id
        }
    })
    const fileInfoArray = files.map((file)=>{
        return {
            fileId: file.key, 
            filename: file.name
        }
    });
    res.json({
        files: fileInfoArray
    });
});