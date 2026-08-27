import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import authRouter from './routes/auth.routes.js';
import messagesRouter from './routes/messages.routes.js';
import { connection } from '../lib/db.js';
import dns from 'dns';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use('/api/auth', authRouter);
app.use('/api/messages', messagesRouter);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/*splat", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
    connection();
});