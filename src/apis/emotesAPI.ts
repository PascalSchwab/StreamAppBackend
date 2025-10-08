import { injectable } from "tsyringe";
import { RequestManager } from "../utils/requestManager";

@injectable()
export class EmotesAPI{
    public async getEmotes(){
        await RequestManager.sendRequest("GET", "https://7tv.io/v3/users/twitch/91427950")
            .then((res)=>{
                if(!res.ok) return [];
                return res.data.emote_set.emotes;
            })
            .catch((err)=>{
                console.error('⚠️ Failed to get emotes:', err);
                return [];
            })
    }
}