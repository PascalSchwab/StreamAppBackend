import tmi, { type Options } from "tmi.js"
import config from "../config";

const opts: Options = {
    identity: {
        username: config.channelName,
        password: "oauth:" + config.accessToken
    },
    channels: [config.channelName],
    connection: { reconnect: true, secure: true },
    options: { debug: false }
};

export const twitchClient = tmi.Client(opts);
twitchClient.connect().catch(console.error);

twitchClient.on("connected", (addr, port) => {
    console.log("Connected to Twitch!");
});