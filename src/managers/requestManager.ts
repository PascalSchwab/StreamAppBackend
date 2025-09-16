import type { RequestType } from "../enums/requestType";
import type RequestBody from "../models/requests/requestBody";
import type RequestResponse from "../models/requests/requestResponse";
import config from "../config";

export default class RequestManager {
    public static async sendRequest(requestType: RequestType, url: string, body?: RequestBody): Promise<RequestResponse> {
        let requestBody: BodyInit | undefined = (typeof body !== "undefined") ? JSON.stringify(body) : undefined;
        let header: RequestInit =
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config.streamElementsToken}`,
                'Accept': 'application/json, charset=utf-8'
            },
            method: requestType,
            body: requestBody
        };
        return await fetch(url, header)
            .then(async (response) => {
                let data = await response.json();
                let requestResponse: RequestResponse = {
                    status: response.status, ok: response.ok, data: data
                };
                return requestResponse;
            })
            .catch((error) => {
                console.error("Fetch error");
                let requestResponse: RequestResponse = { status: 500, ok: false, data: undefined };
                return requestResponse;
            });
    }
}