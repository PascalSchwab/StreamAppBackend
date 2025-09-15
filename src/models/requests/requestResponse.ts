export default interface RequestResponse {
    readonly data: any | undefined
    readonly status: number,
    readonly ok: boolean
}