import type { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { TwitchService } from '../services/twitchService';

const twitchService = container.resolve(TwitchService)

export const changeSlowMode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slowMode = Boolean(req.query.slow_mode);
        res.send(await twitchService.changeSlowMode(slowMode));
    }
    catch (error){
        next(error);
    }
}

export const changeFollowerMode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const followerMode = Boolean(req.query.follower_mode);
        res.send(await twitchService.changeSlowMode(followerMode));
    }
    catch (error){
        next(error);
    }
}

export const changeSubMode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subMode = Boolean(req.query.subscriber_mode);
        res.send(await twitchService.changeSubMode(subMode));
    }
    catch (error){
        next(error);
    }
}

export const changeEmoteMode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const emoteMode = Boolean(req.query.emote_mode);
        res.send(await twitchService.changeEmoteMode(emoteMode));
    }
    catch (error){
        next(error);
    }
}