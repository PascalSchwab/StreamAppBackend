import type MessageUser from "./messageUser"

export default interface Message {
    timestamp: string | undefined,
    text: string,
    channel: string,
    user: MessageUser
}