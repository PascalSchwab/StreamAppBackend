import tmi, { type Options } from "tmi.js"
import config from "../config";
import { EventBus } from "../utils/eventBus";
import { RequestManager } from "../utils/requestManager";
import { injectable } from "tsyringe";

const opts: Options = {
    identity: {
        username: config.twitchChannelName,
        password: "oauth:" + config.twitchAccessToken
    },
    channels: [config.twitchChannelName],
    connection: { reconnect: true, secure: true },
    options: { debug: false }
};

export type TwitchEvents = {
  connected: void;
  message: { channel: string; userstate: tmi.ChatUserstate; text: string, self: boolean };
  error: Error;
};

@injectable()
export class TwitchAPI{
    private _client;
    private _events = new EventBus<TwitchEvents>();
    
    constructor(){
        this._client = tmi.Client(opts);
    }

    public init(){
        this._client.connect().catch((err) => {
            console.error(`[${this.constructor.name}] Connection error:`, err);
            this._events.emit("error", err);
        });
        this._registerEvents();
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
        this._client.say(config.twitchChannelName, message);
    }

    public async changeChatSettings(slowMode?: boolean, followerOnly?: boolean, subOnly?: boolean, emoteOnly?: boolean){
        const body: Record<string, boolean> = {};
        if(slowMode) body.slow_Mode = slowMode;
        if(followerOnly) body.follower_mode = followerOnly;
        if(subOnly) body.subscriber_mode = subOnly;
        if(emoteOnly) body.emote_mode = emoteOnly;
        return await RequestManager.sendRequest("PATCH", `https://api.twitch.tv/helix/chat/settings?broadcaster_id=${config.twitchBroadcasterId}&moderator_id=${config.twitchBroadcasterId}`,
        {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.twitchAccessToken}`,
            "Client-ID": config.twitchClientId,
            'Accept': 'application/json, charset=utf-8'
        }, body).then((res)=>{
            const data = res.data.data;
            return {
                "slow_mode": data.slow_mode,
                "follower_mode": data.follower_mode,
                "subscriber_mode": data.subscriber_mode,
                "emote_mode": data.emote_mode
            }
        })
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