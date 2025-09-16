import type SupportInfo from "./supportInfo"

export default interface MessageUser{
    name: string | undefined,
    supportInfo: SupportInfo,
    color: string | undefined,
    firstMessage: boolean | undefined,
    returnedChatter: boolean | undefined
}