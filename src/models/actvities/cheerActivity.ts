import type { Activity } from "./activity";

export interface CheerActivity extends Activity{
    amount: number,
    name: string,
    message: string | undefined
}