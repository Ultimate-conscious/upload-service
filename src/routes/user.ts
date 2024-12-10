import { Router } from "express";
import { prisma } from "..";


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
    const {email, password, name} = req.body;
    //TODO: input validation

    const existinguser = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(existinguser){
        res.status(400).json({error: "User already exists"});
        return;
    }
    // TODO: hash the password
    const user = await prisma.user.create({
        data: {
            email,
            password,
            name
        }
    })
    //TODO: JWT token
    res.status(201).json({message: "User created successfully"});

});

/**
 * @description This route is used to login a user
 * @route POST /user/login
 * @body {email: string, password: string}
 */
userRouter.post("/login", async (req, res) => {
    const {email, password} = req.body;
    //TODO: input validation

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(!user){
        res.status(400).json({error: "User does not exist"});
        return;
    }
    if(user.password !== password){
        res.status(400).json({error: "Invalid password"});
        return;
    }
    // TODO: JWT token
    res.status(200).json({message: "User logged in successfully"});
});
