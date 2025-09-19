import type Message from './message';
import config from "../../config";

export default class ChatHistory{
    private messages : Array<Message> = [];
    
    pushHistory(message: Message) : void {
        this.messages.push(message);
        if (this.messages.length > config.maxHistory) this.messages.shift();
    }

    getMessages(): Array<Message>{
        return this.messages;
    }
}

/*

twitch.on('message', (channel, userstate, message, self) => {
    if(self) return;
    console.log(channel);
    console.log(userstate);
    console.log(message);
});

*/