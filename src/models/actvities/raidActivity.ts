import type { Activity } from "./activity.ts";

export interface RaidActivity extends Activity{
    amount: number,
    name: string,
    message: string | undefined
}