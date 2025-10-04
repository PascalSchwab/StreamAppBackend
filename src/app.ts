import express from 'express';
import activityRoutes from "./routes/activityRoutes"
import http from 'http'
import {Server} from "socket.io"
import "./services/streamElementsService"
import { StreamElementsService } from './services/streamElementsService';
import ChatHistory from './models/chat/chatHistory';
import { TwitchService } from './services/twitchService';
import { ObsService } from './services/obsService';
import { EmotesService } from './services/emotesService';
import { SocketHandleService } from './services/socketHandlerService';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/activity", activityRoutes);

const twitchService = new TwitchService();
const streamElementsService = new StreamElementsService();
const obsService = new ObsService();
const emotesService = new EmotesService();
const socketHandleService = new SocketHandleService();

const chatHistory = new ChatHistory();

const server = http.createServer(app);
const socketServer = new Server(server, {
    cors: { origin: '*' }
});

socketHandleService.init(socketServer);

export { server, chatHistory, twitchService, streamElementsService };