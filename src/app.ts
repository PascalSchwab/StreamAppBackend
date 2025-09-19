import express from 'express';
import activityRoutes from "./routes/activityRoutes"
import http from 'http'
import {Server} from "socket.io"
import { chatHistory } from './jobs/chatJob';
import { getActivityHistory } from './jobs/activityJob';
import { sendMessageToTwitch } from "./jobs/twitchJob";
import config from './config';
import "./jobs/activityJob"
import "./jobs/chatJob"

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/activity", activityRoutes);

const server = http.createServer(app);
const socketServer = new Server(server, {
    cors: { origin: '*' }
});
socketServer.on("connection", async (socket)=>{
    if(socket.handshake.query.password && socket.handshake.query.password === config.password){
        socket.emit("chat:history", chatHistory.getMessages());
        socket.emit("activity:history", await getActivityHistory());
        socket.on("chat:reply", (text) => {
            sendMessageToTwitch(text);
        });
    }
    else{
        socket.disconnect();
    }
});

export { server, socketServer };