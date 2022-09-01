import { InformacionAlumno } from '../../../core/domain/users';
import { careerDataSource } from './../../../network/careersDataSource';
import { CareerScrapper } from '../../scrapper/careerScrapper';
import { Request, Response } from "express";
import { BaseController, CustomRequest } from "../baseController";
import { userDataSource } from '../../../network/userDataSource';
import jwt from 'jsonwebtoken'
import { AuthScrapper } from '../../scrapper/authScrapper';
import axios from 'axios';

class UserController extends BaseController {


    protected config() {
        this.router.get("/",
            (req, res, next) => this.verifyToken(req, res, next),
            (req, res) => this.getUser(req as CustomRequest, res))

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

            let userInfo: InformacionAlumno | null = null;

            if (careers == null){
                console.error(loginResponse)
                return res.status(403).send("Usuario o contraseña incorrectos")
            }

            if (careers != null && careers[0] != null) {
                const userInfoResponse = await careerDataSource.getUserInfoResponse(careers[0], user, trim!);
                careerScrapper.loadResponse(userInfoResponse);
                userInfo = careerScrapper.getStudentInfo();
            }


            const token = jwt.sign({
                user: user,
                name: userInfo?.nombre,
                trim: trim,
                careers: careers,
            }, process.env.SECRET!, {
                expiresIn: "30m"
            })

            res.status(200).json({
                nombre: userInfo?.nombre,
                matricula: user,
                carreras: careers,
                foto:userInfo?.foto,
                token,
            })
        } catch (error: any) {
            console.error(error)

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.status(500).send(error.message)
        }

    }

    async getUser(req: CustomRequest, res: Response) {
        try {

            res.status(200).json({
                nombre: req.name,
                matricula: req.user,
                carreras: req.careers,
            })

        } catch (error: any) {
            console.error(error)

            if (axios.isAxiosError(error))
                return res.status(503).send("SIASE no funciona")

            res.status(500).send(error.message)
        }
    }

}

export const userController = new UserController();
