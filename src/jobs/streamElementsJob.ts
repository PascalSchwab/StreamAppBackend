import { io } from "socket.io-client"
import config from "../config.ts";

export const streamElementsSocket = io("https://realtime.streamelements.com", {
    transports: ["websocket"],
});

streamElementsSocket.on("connect", () => {
    streamElementsSocket.emit("authenticate", { method: 'jwt', token: config.streamElementsToken });
    console.log("Connected to StreamElements!");
});

streamElementsSocket.on("authenticated", (data) => {
    console.log("✅ Authenticated with StreamElements:");
});

streamElementsSocket.on("unauthorized", (err) => {
    console.error("❌ Authentication failed:", err);
});

streamElementsSocket.on("disconnect", () => {
    console.log("Disconnected from StreamElements");
});