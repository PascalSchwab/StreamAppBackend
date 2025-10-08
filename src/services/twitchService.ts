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
        this._twitchAPI.changeToFollowerOnly(true)
    }

    public sendMessage(message: string){
        this._twitchAPI.sendMessage(message);
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