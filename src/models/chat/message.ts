import type MessageUser from "./messageUser.ts"

export default interface Message {
    timestamp: string | undefined,
    text: string,
    channel: string,
    user: MessageUser
}