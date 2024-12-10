import { Router } from "express";
import { prisma } from "..";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { LoginSchema, SignupSchema } from "../utils/types";

export const userRouter = Router();

userRouter.get('/', (req, res) => {
    res.send("User Route check");
});

/**
 * @description This route is used to sign up a user
 * @route POST /user/signup
 * @body {email: string, password: string, name: string}
 */
userRouter.post("/signup", async (req, res) => {
    try {
        
        const { success } = SignupSchema.safeParse(req.body);
    
        if(!success){
            res.status(400).json({error: "Invalid input"});
            return;
        }
        const {email, password, name} = req.body;
    
        const existinguser = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(existinguser){
            res.status(400).json({error: "User already exists"});
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        })
    
        const token = jwt.sign({id:user.id ,email}, process.env.JWT_SECRET || "",{expiresIn: "1d"});
    
        res.status(201).json({
            message: "User created successfully",
            token
        });

    } catch (error) {
        res.status(500).json({error: "Internal server error, please try again later"});
    }


});

/**
 * @description This route is used to login a user
 * @route POST /user/login
 * @body {email: string, password: string}
 */
userRouter.post("/login", async (req, res) => {

    try {
        
        const { success } = LoginSchema.safeParse(req.body);
    
        if(!success){
            res.status(400).json({error: "Invalid input"});
            return;
        }
    
        const {email, password} = req.body;
    
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(!user){
            res.status(400).json({error: "User does not exist"});
            return;
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if(!result){
                res.status(400).json({error: "Invalid password"});
                return;
            }
        });
    
        const token = jwt.sign({id:user.id ,email}, process.env.JWT_SECRET || "",{expiresIn: "1d"});
    
        res.status(200).json({
            message: "User logged in successfully",
            token
        });

    } catch (error) {
        res.status(500).json({error: "Internal server error, please try again later"});
        
    }

    
});
