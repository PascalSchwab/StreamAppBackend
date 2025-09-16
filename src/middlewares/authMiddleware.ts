import type { Request, Response, NextFunction } from 'express';
import config from '../config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const password = req.query.password;
        if(password && password === config.password) return next();
        return res.sendStatus(401);
    }
    catch (error){
        next(error);
    }
}