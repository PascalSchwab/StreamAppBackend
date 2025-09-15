import dotenv from "dotenv";

dotenv.config();

interface Config {
  password: string,
  channelName: string;
  accessToken: string;
  clientId: string;
  maxHistory: number;
  streamElementsToken: string;
  streamElementsId: string;
}

const config: Config = {
  password: process.env.PASSWORD || "test",
  channelName: process.env.CHANNEL_NAME || "blazertyp",
  accessToken: process.env.ACCESS_TOKEN || "1234",
  clientId: process.env.CLIENT_ID || "1234",
  maxHistory: Number(process.env.MAX_HISTORY) || 500,
  streamElementsToken: process.env.STREAM_ELEMENTS_TOKEN || "1234",
  streamElementsId: process.env.STREAM_ELEMENTS_ID || "1234"
};

export default config;