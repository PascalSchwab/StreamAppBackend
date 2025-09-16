import express from 'express';
import activityRoutes from "./routes/activityRoutes"
import http from 'http'
import {Server} from "socket.io"
import { chatHistory } from './jobs/chatJob';
import { getActivityHistory } from './jobs/activityJob';
import config from './config';
import "./jobs/activityJob"
import "./jobs/chatJob"

const app = express();
const server = http.createServer(app);
const socketServer = new Server(server, {
    cors: { origin: '*' }
});
app.use(express.json());

app.use("/api/activity", activityRoutes);

socketServer.on("connection", async (socket)=>{
    if(socket.handshake.query.password && socket.handshake.query.password === config.password){
        console.log('Client connected', socket.id);
        socketServer.emit("chat:history", chatHistory);
        socketServer.emit("activity:history", await getActivityHistory());
    }
    else{
        socket.disconnect();
    }
});

export { server, socketServer };