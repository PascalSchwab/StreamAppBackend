import type { Request, Response, NextFunction } from 'express';
import { RequestManager } from '../utils/requestManager';
import config from '../config';

export const restartActivity = (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.query.id;
        if(!id) res.sendStatus(400);
        return RequestManager.sendRequest("POST", `https://api.streamelements.com/kappa/v2/activities/${config.streamElementsId}/${id}/replay`,
        {
            "Content-Type": "application/json",
            "Authentication": `Bearer ${config.streamElementsToken}`,
            'Accept': 'application/json, charset=utf-8'
        }
        ).then((response)=>{
            console.log(response)
            return res.sendStatus(200);
        });
    }
    catch (error){
        next(error);
    }
}