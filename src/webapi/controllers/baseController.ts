import { TokenPayload } from './../models/models';
import { Request, Router } from "express";
import jwt from 'jsonwebtoken';

export interface CustomRequest extends Request {
    user: string;
}
export class BaseController {
    private HALF_HOUR = 30 * 1000 * 60;

    router: Router = Router();

    async verifyToken(req: any, res: any, next: any) {
        try {
            if (!req.headers.authorization)
                return res.status(401).send('Unauhtorized Request');

            let token = req.headers.authorization.split(' ')[1];

            if (token === 'null')
                return res.status(401).send('Unauhtorized Request');


            const payload = jwt.verify(token, process.env.SECRRET!) as TokenPayload;

            if (!payload)
                return res.status(401).send('Unauhtorized Request');

            const now = new Date().getTime();

            if (now - payload.loginDate > this.HALF_HOUR)
                return res.status(401).send('Session time exceeded');


            req.user = payload.user;

            next();

        } catch (e) {
            return res.status(401).send('Unauhtorized Request');
        }
    }
}