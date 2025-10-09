import dotenv from "dotenv";

dotenv.config();

interface Config {
  password: string,
  twitchChannelName: string;
  twitchClientId: string;
  twitchAccessToken: string;
  twitchRefreshToken: string;
  twitchBroadcasterId: string;
  maxHistory: number;
  streamElementsToken: string;
  streamElementsId: string;
}

const config: Config = {
  password: process.env.PASSWORD || "test",
  twitchChannelName: process.env.TWITCH_CHANNEL_NAME || "blazertyp",
  twitchClientId: process.env.TWITCH_CLIENT_ID || "1234",
  twitchAccessToken: process.env.TWITCH_ACCESS_TOKEN || "1234",
  twitchRefreshToken: process.env.TWITCH_REFRESH_TOKEN || "1234",
  twitchBroadcasterId: process.env.TWITCH_BROADCASTER_ID || "1234",
  maxHistory: Number(process.env.MAX_HISTORY) || 500,
  streamElementsToken: process.env.STREAM_ELEMENTS_TOKEN || "1234",
  streamElementsId: process.env.STREAM_ELEMENTS_ID || "1234"
};

export default config;