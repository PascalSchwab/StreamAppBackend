import type { Activity } from "./activity.ts";

export interface TipActivity extends Activity{
    amount: number,
    message: string | undefined,
    name: string
}