"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const client_1 = require("@prisma/client");
const user_1 = require("./routes/user");
const file_1 = require("./routes/file");
(0, dotenv_1.config)();
// initalize certain clients
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "3000");
exports.prisma = new client_1.PrismaClient();
// global middle wares
app.use(express_1.default.json());
// routing 
app.use("/user", user_1.userRouter);
app.use("/file", file_1.fileRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
