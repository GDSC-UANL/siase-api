import { TokenPayload } from '@siaseApi/webapi/models/models';
import { Request, Router } from "express";
import jwt from 'jsonwebtoken';
import { Carrera } from '@siaseApi/core/domain/careers';

export interface CustomRequest extends Request<any> {
    user: string;
    trim: string;
    careers: Carrera[];
    picture: string;
    name: string;
}
export abstract class BaseController {

    router: Router = Router();

    constructor() {
        this.config();
    }

    protected abstract config(): void;



    async verifyToken(req: any, res: any, next: any) {
        try {
            res.setHeader("Content-Type", "application/json; charset=utf-8");

            if (!req.headers.authorization)
                return res.status(401).send('Unauhtorized Request');

            let token = req.headers.authorization.split(' ')[1];
            if (token === 'null')
                return res.status(401).send('Unauhtorized Request');


            const payload = jwt.verify(token, process.env.SECRET!) as TokenPayload;

            if (!payload)
                return res.status(401).send('Invalid or expired token');


            req.name = payload.name;
            req.user = payload.user;
            req.trim = payload.trim;
            req.careers = payload.careers;
            req.picture = payload.picture;

            next();

        } catch (e) {
            console.error(e);
            return res.status(401).send('Unauhtorized Request');
        }
    }
}
