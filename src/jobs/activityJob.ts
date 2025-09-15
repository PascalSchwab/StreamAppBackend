import config from "../config.ts";
import { streamElementsSocket } from "./streamElementsJob.ts";
import RequestManager from "../managers/requestManager.ts";
import type { Activity } from "../models/actvities/activity.ts";
import type { FollowActivity } from "../models/actvities/followActivity.ts";
import type { RaidActivity } from "../models/actvities/raidActivity.ts";
import type { TipActivity } from "../models/actvities/tipActivity.ts";
import type { SubscribeActivity } from "../models/actvities/subscribeActivity.ts";
import type { CheerActivity } from "../models/actvities/cheerActivity.ts";
import type { ChannelPointsActivity } from "../models/actvities/channelPointsActivity.ts";
import { socketServer } from "../app.ts";

export const getActivityHistory = async () => {
    let after = new Date();
    after.setUTCHours(0, 0, 0, 0);
    after.setUTCDate(after.getUTCDate()-2)
    let before = new Date();
    before.setUTCHours(0, 0, 0, 0);
    before.setUTCDate(before.getUTCDate()+2)
    return await RequestManager.sendRequest("GET", `https://api.streamelements.com/kappa/v2/activities/${config.streamElementsId}?after=${toUrlEncodedIso(after)}&before=${toUrlEncodedIso(before)}&limit=50&mincheer=0&minhost=0&minsub=0&mintip=0&origin=*&types=follow&types=raid&types=tip&types=subscriber&types=cheer&types=channelPointsRedemption`).then((response)=>{
        const activities : Array<Activity> = [];
        for(const activity of response.data){
            activities.push(createActivity(activity));
        }
        return activities;
    });
};

streamElementsSocket.on("event", (activity) => {
    socketServer.emit("activity:event", createActivity(activity));
});

function createActivity(activity: any) : Activity{
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

function toUrlEncodedIso(date: Date) {
    const iso = date.toISOString().slice(0, 19) + "Z";
    return encodeURIComponent(iso);
}