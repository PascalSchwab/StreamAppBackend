import express from 'express';
import activityRoutes from "./routes/activityRoutes"
import http from 'http'
import {Server} from "socket.io"
import config from './config';
import "./services/streamElementsService"
import { StreamElementsService } from './services/streamElementsService';
import ChatHistory from './models/chat/chatHistory';
import { TwitchService } from './services/twitchService';
import { ObsService } from './services/obsService';
import { EmotesService } from './services/emotesService';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/activity", activityRoutes);

const twitchService = new TwitchService();
const streamElementsService = new StreamElementsService();
const obsService = new ObsService();
const emotesService = new EmotesService();

const chatHistory = new ChatHistory();

const server = http.createServer(app);
const socketServer = new Server(server, {
    cors: { origin: '*' }
});
socketServer.on("connection", async (socket)=>{
    if(socket.handshake.query.password && socket.handshake.query.password === config.password){
        socket.emit("chat:history", chatHistory.getMessages());
        socket.emit("activity:history", await streamElementsService.getActivityHistory());
        socket.on("chat:reply", (text) => {
            twitchService.sendMessage(text);
        });
        socket.on("map:show", (coord) => {
            
        });
    }
    else{
        socket.disconnect();
    }
});

export { server, socketServer, chatHistory, twitchService };