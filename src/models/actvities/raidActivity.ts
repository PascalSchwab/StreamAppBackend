import type { Activity } from "./activity";

export interface RaidActivity extends Activity{
    amount: number,
    name: string,
    message: string | undefined
}