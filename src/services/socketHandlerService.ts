import { Server, Socket } from "socket.io";
import config from '../config';
import { chatHistory } from "../app";
import { container, injectable } from "tsyringe";
import { StreamElementsService } from "./streamElementsService";
import { TwitchService } from "./twitchService";

@injectable()
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
        socket.emit("activity:history", await container.resolve(StreamElementsService).getActivityHistory());

        socket.on("chat:reply", (text: string) => {
            container.resolve(TwitchService).sendMessage(text);
        });

        socket.on("map:show", (coord) => {
            
        });
    }
}