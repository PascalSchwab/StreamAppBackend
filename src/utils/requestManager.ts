import type RequestBody from "../models/requests/requestBody";
import type RequestResponse from "../models/requests/requestResponse";
import config from "../config";

const RequestType = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH"
} as const;

export type RequestType = typeof RequestType[keyof typeof RequestType];

export class RequestManager {
    public static async sendRequest(requestType: RequestType, url: string, header?: HeadersInit, body?: RequestBody): Promise<RequestResponse> {
        let requestBody: BodyInit | undefined = (typeof body !== "undefined") ? JSON.stringify(body) : undefined;
        let headers : HeadersInit = header ? header :
        {
            "Content-Type": "application/json",
            'Accept': 'application/json, charset=utf-8'
        }
        let request: RequestInit =
        {
            headers: headers,
            method: requestType,
            body: requestBody
        };
        return await fetch(url, request)
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