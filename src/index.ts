import express from 'express';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { userRouter } from './routes/user';
import { fileRouter } from './routes/file';
config();

// initalize certain clients
const app = express();
const PORT = parseInt(process.env.PORT || "3000");
export const prisma = new PrismaClient();
// global middle wares
app.use(express.json());

// routing 
app.use("/user",userRouter);
app.use("/file", fileRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 