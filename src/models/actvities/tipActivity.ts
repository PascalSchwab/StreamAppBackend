import type { Activity } from "./activity";

export interface TipActivity extends Activity{
    amount: number,
    message: string | undefined,
    name: string
}