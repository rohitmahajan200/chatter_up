import express from 'express';
import authRoutes from './route/auth.route.js'
import messageRoutes from './route/message.route.js'
import { connetDB } from './lib/dbconfig.js';
import cookieParser from "cookie-parser";
import { app,server } from './lib/socket.js';
import cors from "cors"

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
    origin:"http://localhost:5173",
    credentials:true
    }
))
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

server.listen(3000, () => {
    console.log("Server is up on port 3000");
    connetDB();
}) 