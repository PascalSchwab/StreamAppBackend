import type { Activity } from "./activity";

export interface SubscribeActivity extends Activity{
    amount: number,
    name: string,
    message: string | undefined,
    gifted: boolean | undefined,
    sender: string | undefined
}