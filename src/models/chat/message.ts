import type MessageUser from "./messageUser"
import SuperChat from "./superChat"

export default interface Message {
    timestamp: string | undefined,
    text: string,
    channel: string | undefined,
    user: MessageUser,
    superChat: SuperChat | undefined,
    platform: string
}