import { EmotesAPI } from "../apis/emotesAPI";

export class EmotesService{
    private _emotesAPI : EmotesAPI;
        
    constructor(){
        this._emotesAPI = new EmotesAPI();
        this.getEmotes();
    }

    public async getEmotes(){
        return this._emotesAPI.getEmotes();
    }
}