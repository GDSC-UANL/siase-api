import { CareerScrapper } from '../../scrapper/careerScrapper';
import { Request, Response } from "express";
import { BaseController } from "../baseController";
import { userDataSource } from '../../../network/userDataSource';
import jwt from 'jsonwebtoken'
import { AuthScrapper } from '../../scrapper/authScrapper';

class UserController extends BaseController {


    protected config() {
        this.router.post("/", (req, res) => this.authUser(req, res))
    }

    async authUser(req: Request, res: Response) {
        try {
            const password = req.body.password

            const user = req.body.user

            const loginResponse = await userDataSource.loginUser(user, password);

            const careerScrapper = new CareerScrapper(loginResponse);

            const authScrapper = new AuthScrapper(loginResponse);

            const careers = careerScrapper.getCareersFromLoginResponse()

            const trim = authScrapper.getTrimFromLoginResponse();

            const token = jwt.sign({
                user: user,
                trim: trim,
            }, process.env.SECRET!, {
                expiresIn: "30m"
            })

            res.status(200).json({ token, careers })
        } catch (error: any) {
            console.error(error)
            res.status(500).send(error.message)
        }

    }

}

export const userController = new UserController();