import { io } from "socket.io-client"
import config from "../config";
import { EventBus } from "../utils/eventBus";
import { RequestManager } from "../utils/requestManager";
import { injectable } from "tsyringe";

export type StreamElementsEvents = {
  connected: void;
  disconnected: void;
  event: object;
  error: Error;
};

@injectable()
export class StreamElementsAPI{
    private _client;
    private _events = new EventBus<StreamElementsEvents>();

    constructor(){
        this._client = io("https://realtime.streamelements.com", {
            transports: ["websocket"]
        });
    }

    public init(){
        this._registerEvents();
    }

    private _registerEvents(){
        this._client.on("connect", ()=>{
            this._client.emit("authenticate", { method: 'jwt', token: config.streamElementsToken });
        });

        this._client.on("authenticated", ()=>{
            console.log("✅ Connected to StreamElements");
            this._events.emit("connected", undefined);
        });

        this._client.on("unauthorized", (err) => {
            console.error("❌ Authentication to StreamElements failed:", err);
            this._events.emit("error", err);
        });

        this._client.on("event", (event) => {
            this._events.emit("event", event);
        });

        this._client.on("disconnected", () => {
            console.log("Disconnected from StreamElements");
        });
    }

    public async getActivityHistory() : Promise<any>{
        let after = new Date();
        after.setUTCHours(0, 0, 0, 0);
        after.setUTCDate(after.getUTCDate()-2)
        let before = new Date();
        before.setUTCHours(0, 0, 0, 0);
        before.setUTCDate(before.getUTCDate()+2)
        return await RequestManager.sendRequest("GET", `https://api.streamelements.com/kappa/v2/activities/${config.streamElementsId}?after=${this._toUrlEncodedIso(after)}&before=${this._toUrlEncodedIso(before)}&limit=50&mincheer=0&minhost=0&minsub=0&mintip=0&origin=*&types=follow&types=raid&types=tip&types=subscriber&types=cheer&types=channelPointsRedemption`,
        {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.streamElementsToken}`,
            'Accept': 'application/json, charset=utf-8'
        }).then((response)=>{
            return response.data;
        });
    }

    public on<K extends keyof StreamElementsEvents>(
        event: K,
        handler: (payload: StreamElementsEvents[K]) => void
    ) {
        this._events.on(event, handler);
    }

    public off<K extends keyof StreamElementsEvents>(
        event: K,
        handler: (payload: StreamElementsEvents[K]) => void
    ) {
        this._events.off(event, handler);
    }

    private _toUrlEncodedIso(date: Date) {
        const iso = date.toISOString().slice(0, 19) + "Z";
        return encodeURIComponent(iso);
    }
}

export const streamElementsAPI = new StreamElementsAPI();