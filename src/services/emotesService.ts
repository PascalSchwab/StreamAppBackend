import { inject, injectable } from "tsyringe";
import { EmotesAPI } from "../apis/emotesAPI";

@injectable()
export class EmotesService{        
    constructor(@inject(EmotesAPI) private readonly _emotesAPI: EmotesAPI){
        this.getEmotes();
    }

    public async getEmotes(){
        return this._emotesAPI.getEmotes();
    }
}