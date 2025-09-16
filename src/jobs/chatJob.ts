import ChatHistory from "../models/chat/chatHistory";
import type Message from "../models/chat/message";
import type MessageUser from "../models/chat/messageUser";
import type SupportInfo from "../models/chat/supportInfo";
import { twitchClient } from "./twitchJob";
import { socketServer } from "../app";

export const chatHistory = new ChatHistory();

twitchClient.on('message', (channel, userstate, text, self) => {
    if(self) return;
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
});