import type { Activity } from "./activity.ts";

export interface ChannelPointsActivity extends Activity{
    name: string,
    redemption: string
}