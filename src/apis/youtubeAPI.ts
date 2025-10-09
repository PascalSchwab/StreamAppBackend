import { injectable } from "tsyringe";
import { EventBus } from "../utils/eventBus";
import { LiveChat } from "youtube-chat";
import config from "../config";
import { ChatItem } from "youtube-chat/dist/types/data";

export type YoutubeEvents = {
    connected: void;
    message: ChatItem;
    disconnected: void;
    error: any;
}

@injectable()
export class YoutubeAPI{
    private _client;
    private _events = new EventBus<YoutubeEvents>();

    constructor(){
        this._client =  new LiveChat({channelId: config.youtubeChannelId});
    }

    public async init(){
        const ok = await this._client.start()
        this._client.start().then((ok)=>{
            if(!ok){
                console.error(`[${this.constructor.name}] Failed to connect to youtube`);
                this._events.emit("error", new Error("Failed to connect to youtube"));
            }
        });
        this._registerEvents();
    }

    private _registerEvents(){
        this._client.on("start", () => {
            this._events.emit("connected", undefined);
        });

        this._client.on("end", () => {
            this._events.emit("disconnected", undefined);
        });

        this._client.on("chat", (message) => {
            this._events.emit("message", message);
        });

        this._client.on("error", (err) => {
            this._events.emit("error", err);
        });
    }

    public on<K extends keyof YoutubeEvents>(
        event: K,
        handler: (payload: YoutubeEvents[K]) => void
    ) {
        this._events.on(event, handler);
    }

    public off<K extends keyof YoutubeEvents>(
        event: K,
        handler: (payload: YoutubeEvents[K]) => void
    ) {
        this._events.off(event, handler);
    }

    deconstructor(){
        this._client.stop();
    }
}