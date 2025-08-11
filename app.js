import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser"
import logger  from 'morgan';
import adminRouter from "./routers/admin.router.js"
import cors from "cors"
import connectWithRetry from "./db/mongoose-connection.js";
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

connectWithRetry();


app.use(cors());

app.use("/", adminRouter)


app.listen(3000,()=>{
    console.log("👷🏽‍♂️ Admin Micro Service running on 3000")
})