import type { Request, Response, NextFunction } from 'express';
import RequestManager from '../managers/requestManager';
import config from '../config';

export const restartActivity = (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.query.id;
        if(!id) res.sendStatus(400);
        return RequestManager.sendRequest("POST", `https://api.streamelements.com/kappa/v2/activities/${config.streamElementsId}/${id}/replay`).then((response)=>{
            console.log(response)
            return res.sendStatus(200);
        });
    }
    catch (error){
        next(error);
    }
}