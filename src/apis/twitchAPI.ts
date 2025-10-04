import tmi, { type Options } from "tmi.js"
import config from "../config";
import { EventBus } from "../utils/eventBus";
import { RequestManager } from "../utils/requestManager";

const opts: Options = {
    identity: {
        username: config.channelName,
        password: "oauth:" + config.accessToken
    },
    channels: [config.channelName],
    connection: { reconnect: true, secure: true },
    options: { debug: false }
};

export type TwitchEvents = {
  connected: void;
  message: { channel: string; userstate: tmi.ChatUserstate; text: string, self: boolean };
  error: Error;
};

export class TwitchAPI{
    private _client;
    private _events = new EventBus<TwitchEvents>();
    
    constructor(){
        this._client = tmi.Client(opts);
        this._client.connect().catch((err) => {
            console.error(`[${this.constructor.name}] Connection error:`, err);
            this._events.emit("error", err);
        });
        this._registerEvents();
        this.changeToFollowerOnly(true);
    }

    private _registerEvents(){
        this._client.on("connected", () => {
            console.log("✅ Connected to Twitch!");
            this._events.emit("connected", undefined);
        });

        this._client.on("message", (channel, userstate, text, self) => {
            this._events.emit("message", {channel, userstate, text, self});
        });
    }

    public sendMessage(message: string){
        this._client.say(config.channelName, message);
    }

    public async changeToFollowerOnly(followerOnly: boolean){
        await RequestManager.sendRequest("PATCH", "https://api.twitch.tv/helix/chat/settings?broadcaster_id=" + 91427950 + "&moderator_id=" + 91427950, 
        {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.accessToken}`,
            "Client-ID": config.clientId,
            'Accept': 'application/json, charset=utf-8'
        }, {
            followers_only_mode: followerOnly,
            followers_only_mode_duration: 0
        }).then((res)=>{
            console.log(res);
        })
        .catch((err)=>{
            console.error(err);
        });
    }

    public on<K extends keyof TwitchEvents>(
        event: K,
        handler: (payload: TwitchEvents[K]) => void
    ) {
        this._events.on(event, handler);
    }

    public off<K extends keyof TwitchEvents>(
        event: K,
        handler: (payload: TwitchEvents[K]) => void
    ) {
        this._events.off(event, handler);
    }
}