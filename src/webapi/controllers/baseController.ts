import { TokenPayload } from './../models/models';
import { Request, Router } from "express";
import jwt from 'jsonwebtoken';

export interface CustomRequest extends Request {
    user: string;
    trim: string;
}
export abstract class BaseController {
    private HALF_HOUR = 30 * 1000 * 60;

    router: Router = Router();

    constructor() {
        this.config();
    }

    protected abstract config(): void;

    async verifyToken(req: any, res: any, next: any) {
        try {
            if (!req.headers.authorization)
                return res.status(401).send('Unauhtorized Request');

            let token = req.headers.authorization.split(' ')[1];
            if (token === 'null')
                return res.status(401).send('Unauhtorized Request');


            const payload = jwt.verify(token, process.env.SECRET!) as TokenPayload;

            if (!payload)
                return res.status(401).send('Unauhtorized Request');

            const now = new Date().getTime();
            console.log(now)

            if (now - payload.loginDate > this.HALF_HOUR)
                return res.status(401).send('Session time exceeded');


            req.user = payload.user;
            req.trim = payload.trim;

            next();

        } catch (e) {
            console.error(e);
            return res.status(401).send('Unauhtorized Request');
        }
    }
}