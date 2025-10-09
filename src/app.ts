import express from 'express';
import "reflect-metadata"
import activityRoutes from "./routes/activityRoutes"
import http from 'http'
import { Server } from "socket.io"
import "./services/streamElementsService"
import ChatHistory from './models/chat/chatHistory';
import { container } from 'tsyringe';
import { SocketHandleService } from './services/socketHandlerService';
import { ObsService } from './services/obsService';
import { TwitchService } from './services/twitchService';
import { StreamElementsService } from './services/streamElementsService';
import { YoutubeService } from './services/youtubeService';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/activity", activityRoutes);

const chatHistory = new ChatHistory();

const server = http.createServer(app);
const socketServer = new Server(server, {
    cors: { origin: '*' }
});

// container.resolve(StreamElementsService).init();
// container.resolve(ObsService).init()
// container.resolve(TwitchService).init();
container.resolve(YoutubeService).init();
// container.resolve(SocketHandleService).init(socketServer);

export { server, chatHistory, socketServer };