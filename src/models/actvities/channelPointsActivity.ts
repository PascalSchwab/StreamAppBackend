import type { Activity } from "./activity";

export interface ChannelPointsActivity extends Activity{
    name: string,
    redemption: string
}