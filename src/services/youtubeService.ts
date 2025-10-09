import { inject, injectable } from "tsyringe";
import { YoutubeAPI } from "../apis/youtubeAPI";
import SupportInfo from "../models/chat/supportInfo";
import MessageUser from "../models/chat/messageUser";
import Message from "../models/chat/message";
import SuperChat from "../models/chat/superChat";
import { chatHistory, socketServer } from "../app";

@injectable()
export class YoutubeService{
    constructor(@inject(YoutubeAPI) private readonly _youtubeAPI: YoutubeAPI){

    }

    public init(){
        this._youtubeAPI.init();
        this._registerEvents();
    }

    private _registerEvents(){
        this._youtubeAPI.on("message", (chatItem) => {
            let supportInfo: SupportInfo = {
                mod: chatItem.isModerator,
                subscriber: chatItem.isMembership
            };
            let messageUser: MessageUser = {
                name: chatItem.author.name,
                supportInfo: supportInfo,
                color: undefined,
                firstMessage: undefined,
                returnedChatter: undefined
            };
            let superChat: SuperChat | undefined = undefined;
            if(chatItem.superchat){
                superChat = {
                    amount: chatItem.superchat.amount,
                    color: chatItem.superchat.color
                };
            }
            let message: Message = {
                timestamp: String(chatItem.timestamp.getTime()),
                user: messageUser,
                platform: "Youtube",
                channel: undefined,
                superChat: superChat,
                text: "test"
            };
            chatHistory.pushHistory(message);
            socketServer.emit("chat:message", message);
        });
    }
}