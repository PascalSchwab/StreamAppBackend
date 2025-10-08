import { inject, injectable } from "tsyringe";
import { ObsAPI } from "../apis/obsAPI";

@injectable()
export class ObsService{
    constructor(@inject(ObsAPI) private readonly _obsAPI: ObsAPI){
    }

    public init(){
        this._obsAPI.init();
    }

    public async getStreamStatus(){
        return this._obsAPI.getStreamStatus();
    }

    public async getScenes(){
        return this._obsAPI.getScenes();
    }

    public async getSources(uuid: string, filter?: string[]){
        var result = await this._obsAPI.getSources(uuid);
        if(filter) result = result.filter(source => source.name && filter.includes(String(source.name)))
        return result;
    }

    public async isInputMuted(uuid: string){
        return await this._obsAPI.isInputMuted(uuid);
    }

    public async changeInputMute(uuid: string, muted: boolean){
        await this._obsAPI.changeInputMute(uuid, muted);
    }

    public async changeScene(uuid: string){
        await this._obsAPI.changeScene(uuid);
    }

    public async startStream(start: boolean){
        await this._obsAPI.startStream(start);
    }
}