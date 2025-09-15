import type { Activity } from "./activity.ts";

export interface CheerActivity extends Activity{
    amount: number,
    name: string,
    message: string | undefined
}