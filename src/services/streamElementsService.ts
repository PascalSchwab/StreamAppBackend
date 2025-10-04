import { streamElementsAPI } from "../apis/streamElementsAPI";
import { socketServer } from "../app";
import { Activity } from "../models/actvities/activity";
import { ChannelPointsActivity } from "../models/actvities/channelPointsActivity";
import { CheerActivity } from "../models/actvities/cheerActivity";
import { FollowActivity } from "../models/actvities/followActivity";
import { RaidActivity } from "../models/actvities/raidActivity";
import { SubscribeActivity } from "../models/actvities/subscribeActivity";
import { TipActivity } from "../models/actvities/tipActivity";

export class StreamElementsService{
    constructor(){
        this._registerEvents();
    }

    public async getActivityHistory() {
        const data = await streamElementsAPI.getActivityHistory();
        const activities : Array<Activity> = [];
        for(const activity of data){
            activities.push(this._createActivity(activity));
        }
        return activities;
    }

    private _registerEvents(){
        streamElementsAPI.on("event", (event) => {
            socketServer.emit("activity:event", this._createActivity(event));
        });
    }

    private _createActivity(activity: any) : Activity{
        switch(activity.type){
            case "follow":
                let follow: FollowActivity = {
                    id: activity._id,
                    type: "follow",
                    name: activity.data.displayName
                };
                return follow;
            case "raid":
                let raid: RaidActivity = {
                    id: activity._id,
                    type: "raid",
                    name: activity.data.displayName,
                    amount: activity.data.amount,
                    message: activity.data.message
                }
                return raid;
            case "tip":
                let tip: TipActivity = {
                    id: activity._id,
                    type: "tip",
                    name: activity.data.displayName,
                    amount: activity.data.amount,
                    message: activity.data.message
                }
                return tip;
            case "subscriber":
                let subscriber: SubscribeActivity = {
                    id: activity._id,
                    type: "subscriber",
                    name: activity.data.displayName,
                    amount: activity.data.amount,
                    message: activity.data.message,
                    gifted: activity.data.gifted,
                    sender: activity.data.sender
                }
                return subscriber;
            case "cheer":
                let cheer: CheerActivity = {
                    id: activity._id,
                    type: "cheer",
                    name: activity.data.displayName,
                    amount: activity.data.amount,
                    message: activity.data.message
                }
                return cheer;
            case "channelPointsRedemption":
                let channelPoints: ChannelPointsActivity = {
                    id: activity._id,
                    type: "channelPoints",
                    name: activity.data.displayName,
                    redemption: activity.data.redemption
                }
                return channelPoints;
            default:
                let unknown: Activity = {
                    id: activity._id,
                    type: "unknown"
                }
                return unknown;
        }
    }
}