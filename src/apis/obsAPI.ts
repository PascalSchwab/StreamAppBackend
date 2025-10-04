import { EventBus } from "../utils/eventBus";
import OBSWebSocket from "obs-websocket-js"

export type ObsEvents = {
    connected: void;
    disconnected: void;
    sceneChanged: {name: string, uuid: string};
    streamingStateChanged: boolean;
    error: Error;
};

export class ObsAPI{
    private _client;
    private _events = new EventBus<ObsEvents>();

    constructor(){
        this._client = new OBSWebSocket();
        this._client.connect("ws://retrosize.de:4455", "irl_stream_123")
        .then(async()=>{
            console.log("✅ Connected to OBS!");
            this._events.emit("connected", undefined);
        })
        .catch((err) => {
            console.error(`[${this.constructor.name}] Connection error:`, err);
            this._events.emit("error", err);
        });
        this._registerEvents();
    }

    private _registerEvents(){
        this._client.on("ConnectionClosed", () => {
            console.log("Disconnected from OBS!");
            this._events.emit("disconnected", undefined);
        });

        this._client.on("CurrentProgramSceneChanged", (scene) => {
            this._events.emit("sceneChanged", {name: scene.sceneName, uuid: scene.sceneUuid});
        });

        this._client.on("StreamStateChanged", (state) => {
            if(state.outputState === "OBS_WEBSOCKET_OUTPUT_STARTING" ||
                 state.outputState === "OBS_WEBSOCKET_OUTPUT_STOPPING") return;
            (state.outputActive) ? console.log("✅ Streaming started") : console.log("🛑 Streaming stopped");
            this._events.emit("streamingStateChanged", state.outputActive);
        });
    }

    public async getStreamStatus(){
        try{
            var result = await this._client.call("GetStreamStatus");
            return {streaming: result.outputActive, duration: result.outputDuration};
        }
        catch(err){
            console.error('⚠️ Failed to get stream status:', err);
            return null;
        }
    }

    public async getScenes(){
        try{
            var result = await this._client.call("GetSceneList");
            return {currentScene: {name: result.currentProgramSceneName, uuid: result.currentProgramSceneUuid},
                    scenes: result.scenes.map(({ sceneName: name, sceneUuid: uuid }) => ({ name, uuid }))}
        }
        catch(err){
            console.error('⚠️ Failed to get scene list:', err);
            return null;
        }
    }

    public async getSources(uuid: string){
        try{
            var result = await this._client.call("GetSceneItemList", {sceneUuid: uuid})
            return result.sceneItems.map(({sceneItemEnabled: enabled, sourceName: name, sourceUuid: uuid}) => ({name, uuid, enabled}));
        }
        catch(err){
            console.error(`⚠️ Failed to get sources from scene (${uuid}):`, err);
            return [];
        }
    }

    public async isInputMuted(uuid: string){
        try{
            var result = await this._client.call("GetInputMute", {inputUuid: uuid});
            return {muted: result.inputMuted};
        }
        catch(err){
            console.error(`⚠️ Failed to get input from source (${uuid}):`, err);
            return null;
        }
    }

    public async changeInputMute(uuid: string, muted: boolean){
        try{
            await this._client.call("SetInputMute", {inputUuid: uuid, inputMuted: muted});
        }
        catch(err){
            console.error(`⚠️ Failed to change input from source (${uuid}):`, err);
        }
    }

    public async changeScene(uuid: string){
        try{
            await this._client.call("SetCurrentProgramScene", {sceneUuid: uuid});
        }
        catch(err){
            console.error(`⚠️ Failed to change scene to (${uuid}):`, err);
        }
    }

    public async startStream(start: boolean){
        try{
            if(start) await this._client.call('StartStream');
            else await this._client.call('StopStream');
        }
        catch (err){
            console.error('⚠️ Failed to start/end stream:', err);
        }
    }

    public on<K extends keyof ObsEvents>(
        event: K,
        handler: (payload: ObsEvents[K]) => void
    ) {
        this._events.on(event, handler);
    }

    public off<K extends keyof ObsEvents>(
        event: K,
        handler: (payload: ObsEvents[K]) => void
    ) {
        this._events.off(event, handler);
    }

    deconstructor(){
        this._client.off("ConnectionClosed");
        this._client.off("CurrentProgramSceneChanged");
        this._client.off("StreamStateChanged")
    }
}