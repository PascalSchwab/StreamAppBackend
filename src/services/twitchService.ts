import { inject, injectable } from "tsyringe";
import { TwitchAPI } from "../apis/twitchAPI";
import { chatHistory, socketServer } from "../app";
import Message from "../models/chat/message";
import MessageUser from "../models/chat/messageUser";
import SupportInfo from "../models/chat/supportInfo";

@injectable()
export class TwitchService{
    constructor(@inject(TwitchAPI) private readonly _twitchAPI: TwitchAPI){
        
    }

    public init(){
        this._twitchAPI.init();
        this._registerEvents();
    }

    public sendMessage(message: string){
        this._twitchAPI.sendMessage(message);
    }

    public async changeFollowerMode(followerOnly: boolean){
        return await this._twitchAPI.changeChatSettings(undefined, followerOnly, undefined, undefined);
    }

    public async changeEmoteMode(emoteOnly: boolean){
        return await this._twitchAPI.changeChatSettings(undefined, undefined, undefined, emoteOnly);
    }

    public async changeSlowMode(slowMode: boolean){
        return await this._twitchAPI.changeChatSettings(slowMode, undefined, undefined, undefined);
    }

    public async changeSubMode(subOnly: boolean){
        return await this._twitchAPI.changeChatSettings(undefined, undefined, subOnly, undefined);
    }

    private _registerEvents(){
        this._twitchAPI.on("message", ({channel, userstate, text}) => {
            let supportInfo: SupportInfo = {
                mod: userstate.mod,
                subscriber: userstate.subscriber
            };
            let messageUser: MessageUser = {
                name: userstate["display-name"],
                supportInfo: supportInfo,
                color: userstate.color,
                firstMessage: userstate["first-msg"],
                returnedChatter: userstate["returning-chatter"]
            };
            let message: Message = {
                text: text,
                timestamp: userstate["tmi-sent-ts"],
                channel: channel,
                user: messageUser
            };
            chatHistory.pushHistory(message);
            socketServer.emit("chat:message", message);
        })
    }
}