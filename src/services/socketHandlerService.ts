import { Server, Socket } from "socket.io";
import config from '../config';
import { chatHistory, streamElementsService, twitchService } from "../app";

export class SocketHandleService{
    public init(io: Server){
        io.on("connection", (socket: Socket) => {
            this.handleConnection(socket);
        })
    }

    private async handleConnection(socket: Socket){
        if (socket.handshake.query.password !== config.password) {
            socket.disconnect();
            return;
        }

        socket.emit("chat:history", chatHistory.getMessages());
        socket.emit("activity:history", await streamElementsService.getActivityHistory());

        socket.on("chat:reply", (text: string) => {
            twitchService.sendMessage(text);
        });

        socket.on("map:show", (coord) => {
            
        });
    }
}